import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { PaginatedResponse } from '../../common/interfaces/pagination.interface';
import { BookingStatus } from '@prisma/client';
import { BusinessLoggerService } from '../../common/logger/business-logger.service';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private businessLogger: BusinessLoggerService,
  ) {}

  async createReview(
    bookingId: string,
    clientId: string,
    dto: CreateReviewDto,
  ) {
    // Verify booking exists and belongs to client
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.clientId !== clientId) {
      throw new ForbiddenException('Access denied');
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new ForbiddenException('Can only review completed bookings');
    }

    if (booking.review) {
      throw new ConflictException('Review already exists for this booking');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        bookingId,
        clientId,
        proId: booking.proId,
        rating: dto.rating,
        comment: dto.comment,
        photosBeforeAfter: JSON.stringify(dto.photosBeforeAfter || []),
        isVerifiedClient: dto.isVerifiedClient || false,
      },
      include: {
        client: {
          select: { id: true, email: true, clientProfile: true },
        },
        booking: {
          include: {
            serviceCategory: true,
            city: true,
          },
        },
      },
    });

    // Update pro profile rating stats
    await this.updateProRatingStats(booking.proId);

    // Log business event
    this.businessLogger.logReviewCreated(
      review.id,
      bookingId,
      clientId,
      booking.proId,
      dto.rating,
    );

    return review;
  }

  async getProReviews(
    proId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<any>> {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { proId },
        include: {
          client: {
            select: { id: true, email: true, clientProfile: true },
          },
          booking: {
            include: {
              serviceCategory: true,
              city: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({
        where: { proId },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: reviews,
      total,
      page,
      pageSize: limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async getReviewById(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        client: {
          select: { id: true, email: true, clientProfile: true },
        },
        pro: {
          select: { id: true, email: true, proProfile: true },
        },
        booking: {
          include: {
            serviceCategory: true,
            city: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async getBookingReview(bookingId: string) {
    return this.prisma.review.findUnique({
      where: { bookingId },
      include: {
        client: {
          select: { id: true, email: true, clientProfile: true },
        },
        pro: {
          select: { id: true, email: true, proProfile: true },
        },
        booking: {
          include: {
            serviceCategory: true,
            city: true,
          },
        },
      },
    });
  }

  private async updateProRatingStats(proId: string) {
    // Calculate new average rating and total reviews
    const reviewStats = await this.prisma.review.aggregate({
      where: { proId },
      _avg: { rating: true },
      _count: { id: true },
    });

    // Update pro profile
    await this.prisma.proProfile.update({
      where: { userId: proId },
      data: {
        averageRating: reviewStats._avg?.rating,
        totalReviews: reviewStats._count?.id,
      },
    });
  }

  async getProRatingStats(proId: string) {
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId: proId },
      select: {
        averageRating: true,
        totalReviews: true,
      },
    });

    if (!proProfile) {
      throw new NotFoundException('Pro profile not found');
    }

    // Get rating distribution
    const ratingDistribution = await this.prisma.review.groupBy({
      by: ['rating'],
      where: { proId },
      _count: { rating: true },
    });

    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratingDistribution.forEach((item) => {
      distribution[item.rating as keyof typeof distribution] =
        item._count?.rating || 0;
    });

    return {
      averageRating: proProfile.averageRating || 0,
      totalReviews: proProfile.totalReviews,
      ratingDistribution: distribution,
    };
  }
}
