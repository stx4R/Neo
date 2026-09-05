'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Label } from '@/components/Label';
import { Screen, Section } from '@/components/Screen';
import { TopBar } from '@/components/TopBar';
import { ComboPending } from '@/components/ComboEmpty';
import { EmptyState } from '@/components/EmptyState';
import { useDataset } from '@/lib/dataset';
import { derivedNotifications, groupedNotifications, notificationTime } from '@/lib/derive';
import { useActionsDone } from '@/lib/useActionsDone';
import { markRead, useNotificationsRead } from '@/lib/useNotificationsRead';
import {
  NOTIFICATION_COLOR,
  NOTIFICATION_LABEL,
  type Notification,
} from '@/types/neo';

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
  const [bannerOpen, setBannerOpen] = useState(true);

  const items = ds ? derivedNotifications(ds, done) : [];
  const groups = ds ? groupedNotifications(items, ds.today) : [];
  const unread = items.filter((n) => !read.has(n.id)).length;

  return (
    <Screen scrollPadBottom="var(--pad-plain)">
      <TopBar
        left={
          // router.back()이 아니라 Link다. 딥링크로 들어오면 back()이 갈 곳이 없다.
          <Link
            href="/"
            aria-label="홈으로"
            style={{
              font: '400 20px/1 Pretendard, sans-serif',
              color: 'var(--text)',
              textDecoration: 'none',
            }}
          >
            ←
          </Link>
        }
        right={
          <button
            type="button"
            className="t-meta"
            onClick={() => markRead(items.map((n) => n.id))}
            style={{
              padding: 0,
              border: 'none',
              background: 'transparent',
              color: 'var(--text-3)',
              cursor: 'pointer',
            }}
          >
            모두 읽음
          </button>
        }
      />

      <div style={{ padding: '12px var(--pad) 0' }}>
        <h1 className="t-h1" style={{ margin: 0, color: 'var(--text)' }}>
          알림
        </h1>
        {ds && (
          <p className="t-meta tnum" style={{ margin: '10px 0 0', color: 'var(--text-3)' }}>
            읽지 않음 {unread}
          </p>
        )}
      </div>

      {bannerOpen && <PushBanner onClose={() => setBannerOpen(false)} />}

      {!ds && (
        <div style={{ marginTop: 'var(--sec-gap)', padding: '0 var(--pad)' }}>
          <ComboPending />
        </div>
      )}
      {ds && items.length === 0 && (
        <div style={{ marginTop: 'var(--sec-gap)', padding: '0 var(--pad)' }}>
          <EmptyState message="새로운 알림이 없습니다" />
        </div>
      )}

      {groups.map(({ group, items }) => (
        <Section key={group} label={group}>
          {items.map((n, i) => (
            <NotificationRow
              key={n.id}
              notification={n}
              today={ds!.today}
              read={read.has(n.id)}
              last={i === items.length - 1}
            />
          ))}
        </Section>
      ))}
    </Screen>
  );
}

/** 푸시 권한 블록. 배너 카드가 아니라 색면이다. */
function PushBanner({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ marginTop: 20, padding: '0 var(--pad)' }}>
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--row-gap)',
          padding: '0 var(--block-pad)',
          background: 'var(--accent)',
        }}
      >
        {/* 권한 요청까지만 한다. 발송 서버는 만들지 않는다 — V6 범위 밖이다.
            구독(pushManager.subscribe)도 보낼 곳이 없어 만들지 않는다. */}
        <button
          type="button"
          onClick={async () => {
            try {
              if ('Notification' in window) await Notification.requestPermission();
            } catch {
              // 일부 브라우저는 이 자리에서 throw 한다. 그래도 블록은 닫는다.
            }
            // 허용이든 거부든 닫는다 — 허용했으면 다시 권할 이유가 없고,
            // 거부는 브라우저가 다시 묻지 않는다.
            onClose();
          }}
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 'var(--stack)',
            padding: 0,
            border: 'none',
            background: 'transparent',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <span className="t-h2" style={{ color: 'var(--on-color)' }}>
            시행일 알림 켜기
          </span>
          <span className="t-meta tnum" style={{ color: 'var(--on-color)' }}>
            D-7에 미리 알려드립니다
          </span>
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="알림 배너 닫기"
          style={{
            flex: 'none',
            font: '400 16px/1 Pretendard, sans-serif',
            color: 'var(--on-color)',
            padding: 0,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function NotificationRow({
  notification: n,
  today,
  read,
  last,
}: {
  notification: Notification;
  today: string;
  read: boolean;
  last: boolean;
}) {
  const tone = NOTIFICATION_COLOR[n.type];

  const style = {
    width: '100%',
    height: 78,
    display: 'flex',
    alignItems: 'stretch',
    gap: 'var(--row-gap)',
    borderTop: '1px solid var(--hairline)',
    borderBottom: last ? '1px solid var(--hairline)' : undefined,
    borderLeft: 'none',
    borderRight: 'none',
    padding: 0,
    background: 'transparent',
    textAlign: 'left',
    color: 'inherit',
    font: 'inherit',
    textDecoration: 'none',
    opacity: read ? 0.5 : undefined,
    cursor: 'pointer',
  } as const;

  const inner = (
    <>
      {/* 좌측 세로 색 바. 원형 아이콘 배경을 쓰지 않는다. */}
      <div style={{ flex: 'none', width: 4, background: tone }} />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--stack)',
          justifyContent: 'center',
        }}
      >
        <Label color={tone}>{NOTIFICATION_LABEL[n.type]}</Label>
        <h2
          className="t-h2"
          style={{
            margin: 0,
            color: 'var(--text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {n.title}
        </h2>
        <span className="t-meta tnum" style={{ color: 'var(--text-3)' }}>
          {n.body}
        </span>
      </div>
      <div
        style={{
          flex: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 6,
          justifyContent: 'center',
        }}
      >
        <span className="t-meta tnum" style={{ color: 'var(--text-3)' }}>
          {notificationTime(n.at, today)}
        </span>
        {/* 미읽음 표시. 원형이 아니라 6×6 정사각이다. */}
        {!read && <span style={{ width: 6, height: 6, background: 'var(--accent)' }} />}
      </div>
    </>
  );

  const onActivate = () => markRead([n.id]);

  return n.lawId ? (
    <Link href={`/laws/${n.lawId}`} onClick={onActivate} style={style}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onActivate} style={style}>
      {inner}
    </button>
  );
}
