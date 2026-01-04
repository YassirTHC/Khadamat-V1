// @ts-nocheck
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ClientBooking,
  ClientMessage,
  ClientFavorite,
  ProBooking,
  ProService,
  ProTransaction,
  SupportCategory,
  SupportArticle,
  FAQItem,
} from '@/lib/mocks/services-mocks';

type IconType = React.ComponentType<{ className?: string }>;

export function StatusPill({ status, className }: { status: ClientBooking['status']; className?: string }) {
  return (
    <Badge className={className || ''} variant="default">
      {status}
    </Badge>
  );
}

export function BookingCard({ booking, onClick, className }: { booking: ClientBooking; onClick?: () => void; className?: string }) {
  return (
    <Card className={className || ''} onClick={onClick}>
      <div>{booking.serviceName}</div>
      <div>{booking.status}</div>
    </Card>
  );
}

export function MessageCard({ message, onClick, className }: { message: ClientMessage; onClick?: () => void; className?: string }) {
  return (
    <Card className={className || ''} onClick={onClick}>
      <div>{message.senderName}</div>
      <div>{message.preview}</div>
    </Card>
  );
}

export function ProBookingCard({
  booking,
  onClick,
  onStatusChange,
  onContact,
  className,
}: {
  booking: ProBooking;
  onClick?: () => void;
  onStatusChange?: (status: ProBooking['status']) => void;
  onContact?: () => void;
  className?: string;
}) {
  return (
    <Card className={className || ''} onClick={onClick}>
      <div>{booking.clientName}</div>
      <div>{booking.status}</div>
      <div className="flex gap-2 mt-2">
        {onContact && (
          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onContact(); }}>
            Contacter
          </Button>
        )}
        {onStatusChange && (
          <Button size="sm" onClick={(e) => { e.stopPropagation(); onStatusChange('confirmed'); }}>
            Marquer confirmé
          </Button>
        )}
      </div>
    </Card>
  );
}

export function SupportSearchBar({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      className={`w-full rounded border px-3 py-2 ${className || ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Rechercher'}
    />
  );
}

export function SupportCategoryCard({
  category,
  onClick,
  className,
}: {
  category: SupportCategory;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Card className={className || ''} onClick={onClick}>
      <div className="font-semibold">{category.name}</div>
      <div className="text-sm text-muted-foreground">{category.description}</div>
    </Card>
  );
}

export function SupportArticleCard({
  article,
  onClick,
  className,
}: {
  article: SupportArticle;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Card className={className || ''} onClick={onClick}>
      <div className="font-semibold">{article.title}</div>
      <div className="text-sm text-muted-foreground line-clamp-2">{article.excerpt || article.content}</div>
    </Card>
  );
}

export function SupportFAQAccordion({
  faq,
  isOpen,
  onToggle,
  className,
}: {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <Card className={className || ''}>
      <button className="w-full text-left font-semibold" onClick={onToggle}>
        {faq.question}
      </button>
      {isOpen && <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>}
    </Card>
  );
}

export function FeedbackWidget({ onHelpful, onNotHelpful, className }: { onHelpful: () => void; onNotHelpful: () => void; className?: string }) {
  return (
    <div className={className || ''}>
      <p className="text-sm mb-2">Cet article vous a-t-il aidé ?</p>
      <div className="flex gap-2">
        <Button size="sm" onClick={onHelpful}>Oui</Button>
        <Button size="sm" variant="outline" onClick={onNotHelpful}>Non</Button>
      </div>
    </div>
  );
}

export function SupportContactCard({ className }: { className?: string }) {
  return (
    <Card className={className || ''}>
      <div className="font-semibold mb-1">Besoin d'aide ?</div>
      <div className="text-sm text-muted-foreground">Contactez notre support.</div>
    </Card>
  );
}

export function ServiceCard({
  service,
  onEdit,
  onToggleStatus,
  onDelete,
  className,
}: {
  service: ProService;
  onEdit?: () => void;
  onToggleStatus?: () => void;
  onDelete?: () => void;
  className?: string;
}) {
  return (
    <Card className={className || ''}>
      <div className="font-semibold">{service.name || service.serviceCategoryId}</div>
      <div className="text-sm text-muted-foreground">{service.description}</div>
      <div className="flex gap-2 mt-2">
        {onEdit && <Button size="sm" onClick={onEdit}>Editer</Button>}
        {onToggleStatus && (
          <Button size="sm" variant="outline" onClick={onToggleStatus}>
            {service.isActive ? 'Désactiver' : 'Activer'}
          </Button>
        )}
        {onDelete && (
          <Button size="sm" variant="destructive" onClick={onDelete}>
            Supprimer
          </Button>
        )}
      </div>
    </Card>
  );
}

export function TransactionCard({ transaction, className }: { transaction: ProTransaction; className?: string }) {
  return (
    <Card className={className || ''}>
      <div className="font-semibold">{transaction.title || transaction.id}</div>
      <div className="text-sm text-muted-foreground">{transaction.amount} {transaction.currency || 'MAD'}</div>
    </Card>
  );
}

export function ProStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: IconType;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}) {
  return (
    <Card className={className || ''}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <div className="font-semibold">{title}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <div className="text-sm text-muted-foreground">{subtitle}</div>}
      {trend && (
        <div className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}%
        </div>
      )}
    </Card>
  );
}

export function FavoriteCard({
  favorite,
  onClick,
  onRemove,
  className,
}: {
  favorite: ClientFavorite;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <Card className={className || ''} onClick={onClick}>
      <div className="font-semibold">{favorite.proName}</div>
      <div className="text-sm text-muted-foreground">{favorite.categoryName}</div>
      {onRemove && (
        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
          Retirer
        </Button>
      )}
    </Card>
  );
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: IconType;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}) {
  return (
    <Card className={className || ''}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <div className="font-semibold">{title}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <div className="text-sm text-muted-foreground">{subtitle}</div>}
      {trend && (
        <div className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}%
        </div>
      )}
    </Card>
  );
}
