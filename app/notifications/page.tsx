'use client';

import { useState, useSyncExternalStore } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ComboPending } from '@/components/ComboEmpty';
import { EmptyState } from '@/components/EmptyState';
import { Icon, type IconName } from '@/components/Icon';
import { IconTile } from '@/components/IconTile';
import { Row } from '@/components/Row';
import { Screen } from '@/components/Screen';
import { IconButton, TopBar } from '@/components/TopBar';
import { useDataset } from '@/lib/dataset';
import { derivedNotifications, groupedNotifications, notificationTime } from '@/lib/derive';
import { useActionsDone } from '@/lib/useActionsDone';
import { markRead, useNotificationsRead } from '@/lib/useNotificationsRead';
import {
  NOTIFICATION_LABEL,
  NOTIFICATION_TONE,
  TONE_COLOR,
  type Notification,
} from '@/types/neo';

/** 알림 종류의 아이콘. 색은 NOTIFICATION_TONE이 정한다. */
const NOTIFICATION_ICON: Record<Notification['type'], IconName> = {
  deadline: 'clock',
  status: 'arrow-left-right',
  new: 'plus',
  done: 'circle-check',
};

/**
 * S6 Notifications. 탭바가 없는 화면이다.
 *
 * 알림은 손으로 쓴 JSON이 아니라 법령 데이터에서 파생된다(§B-5).
 * 파생 결과가 0건이면 빈 상태를 보여준다 — 억지로 채우지 않는다.
 */
export default function NotificationsPage() {
  const read = useNotificationsRead();
  const done = useActionsDone();
  const ds = useDataset();

  const items = ds ? derivedNotifications(ds, done) : [];
  const groups = ds ? groupedNotifications(items, ds.today) : [];
  const unread = items.filter((n) => !read.has(n.id)).length;

  return (
    <Screen scrollPadBottom="var(--pad-plain)">
      <TopBar
        inset={16}
        // router.back()이 아니라 링크다. 딥링크로 들어오면 back()이 갈 곳이 없다.
        left={<IconButton icon="chevron-left" label="홈으로" href="/" stroke={2} />}
        right={
          <button
            type="button"
            className="t-body-b tap-y"
            onClick={() => markRead(items.map((n) => n.id))}
            style={{ padding: '0 8px', lineHeight: 1, color: 'var(--tds-fg-brand)', cursor: 'pointer' }}
          >
            모두 읽음
          </button>
        }
      />

      <div style={{ padding: '4px var(--pad) 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h1 className="t-h1">알림</h1>
          {ds && (
            <p className="t-meta tnum" style={{ color: 'var(--tds-fg-tertiary)' }}>
              읽지 않음 {unread}
            </p>
          )}
        </div>

        <PushBanner />

        {!ds && <ComboPending />}
        {ds && items.length === 0 && <EmptyState message="새 알림이 없어요" />}

        {ds &&
          groups.map(({ group, items }) => (
            <section key={group} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h2 className="t-label" style={{ color: 'var(--tds-fg-quaternary)' }}>
                {group}
              </h2>
              <Card padding="2px 20px">
                {items.map((n, i) => (
                  <NotificationRow
                    key={n.id}
                    notification={n}
                    today={ds.today}
                    read={read.has(n.id)}
                    divider={i < items.length - 1}
                  />
                ))}
              </Card>
            </section>
          ))}
      </div>
    </Screen>
  );
}

const noSubscribe = () => () => {};

function readPermission(): NotificationPermission | 'unsupported' {
  return 'Notification' in window ? Notification.permission : 'unsupported';
}

/**
 * 푸시 권한 카드. 권한 요청까지만 한다 — 발송 서버는 만들지 않는다(V6 범위 밖).
 * 구독(pushManager.subscribe)도 보낼 곳이 없어 만들지 않는다.
 *
 * 디자인 원본에 닫기(×)가 없다. 그래서 이미 허용·거부한 기기에서는 처음부터
 * 그리지 않는다 — 브라우저가 다시 묻지 않는 권한을, 닫을 수도 없는 카드로 매번
 * 권하게 된다. 알림 API가 없는 브라우저(iOS 사파리 탭 등)에서도 그리지 않는다.
 */
function PushBanner() {
  const permission = useSyncExternalStore(noSubscribe, readPermission, () => null);
  const [asked, setAsked] = useState(false);

  if (asked || permission !== 'default') return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '18px 20px',
        borderRadius: 'var(--r-card)',
        background: 'var(--tds-bg-brand-weak)',
      }}
    >
      <IconTile tone="brand-solid">
        <Icon name="bell" size={22} />
      </IconTile>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span className="t-subtitle">시행일 알림 받기</span>
        <span className="t-meta tnum" style={{ color: 'var(--tds-fg-secondary)' }}>
          D-7에 미리 알려드려요
        </span>
      </div>
      <Button
        size="s"
        onClick={async () => {
          try {
            await Notification.requestPermission();
          } catch {
            // 일부 브라우저는 이 자리에서 throw 한다. 그래도 카드는 닫는다.
          }
          // 허용이든 거부든 닫는다 — 허용했으면 다시 권할 이유가 없고,
          // 거부는 브라우저가 다시 묻지 않는다.
          setAsked(true);
        }}
      >
        켜기
      </Button>
    </div>
  );
}

function NotificationRow({
  notification: n,
  today,
  read,
  divider,
}: {
  notification: Notification;
  today: string;
  read: boolean;
  divider: boolean;
}) {
  const tone = NOTIFICATION_TONE[n.type];

  return (
    <Row
      // 법령에 매인 알림은 그 상세로 간다. 가면서 읽음으로 표시한다.
      href={n.lawId ? `/laws/${n.lawId}` : undefined}
      onClick={() => markRead([n.id])}
      align="start"
      divider={divider}
      dimmed={read}
      leading={
        <IconTile tone={tone} size={40} radius="13px">
          <Icon name={NOTIFICATION_ICON[n.type]} size={20} stroke={2} />
        </IconTile>
      }
      trailing={
        <span
          style={{
            flex: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 6,
          }}
        >
          <span className="t-small tnum" style={{ color: 'var(--tds-fg-quaternary)' }}>
            {notificationTime(n.at, today)}
          </span>
          {!read && (
            <span
              role="img"
              aria-label="읽지 않음"
              style={{ width: 6, height: 6, borderRadius: 'var(--r-full)', background: 'var(--tds-bg-brand)' }}
            />
          )}
        </span>
      }
    >
      <span className="t-caption" style={{ fontWeight: 600, color: TONE_COLOR[tone].fg }}>
        {NOTIFICATION_LABEL[n.type]}
      </span>
      <span className="t-body-b one-line">{n.title}</span>
      <span className="t-small tnum" style={{ color: 'var(--tds-fg-tertiary)' }}>
        {n.body}
      </span>
    </Row>
  );
}
