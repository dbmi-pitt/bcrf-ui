'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BankOutlined,
  IdcardOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Input, Masonry, Typography } from 'antd';

const AVATAR_COLORS = [
  { bg: '#00364b', text: '#fff' },
  { bg: '#d0006f', text: '#fff' },
  { bg: '#a92778', text: '#fff' },
  { bg: '#002432', text: '#fff' },
  { bg: '#e4e7eb', text: '#00364b' },
  { bg: '#004d6b', text: '#fff' },
  { bg: '#e6297a', text: '#fff' },
  { bg: '#6b1f4a', text: '#fff' },
  { bg: '#005f7f', text: '#fff' },
  { bg: '#f9f8f4', text: '#00364b' },
];

function getInitials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function getAvatarColor(name) {
  const key = name || '';
  const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function UsersGrid({ users }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    // Debounce the query input to avoid filtering on every keystroke
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const filteredUsers = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return users || [];
    return (users || []).filter((user) =>
      [user.uuid, user.name, user.email, user.organization]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q)),
    );
  }, [users, debouncedQuery]);

  return (
    <div>
      <Input.Search
        allowClear
        placeholder="Search by name, email, organization, or UUID"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ maxWidth: 420, marginBottom: 20 }}
      />

      {filteredUsers.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 0',
            color: 'rgba(0, 0, 0, 0.45)',
          }}
        >
          No users found.
        </div>
      ) : (
        <Masonry
          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
          gutter={16}
          items={filteredUsers.map((user, index) => ({
            key: user.email ?? `user-${index}`,
            data: user,
          }))}
          itemRender={({ data: user }) => (
            <Card
              className="c-userCard"
              hoverable
              styles={{
                body: {
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: 20,
                },
              }}
              style={{
                borderRadius: 12,
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
              }}
            >
              <Avatar
                size={48}
                style={{
                  backgroundColor: getAvatarColor(user.name).bg,
                  color: getAvatarColor(user.name).text,
                  flexShrink: 0,
                  fontWeight: 600,
                }}
                icon={!user.name ? <UserOutlined /> : undefined}
              >
                {user.name ? getInitials(user.name) : undefined}
              </Avatar>

              <div style={{ overflow: 'hidden', minWidth: 0 }}>
                <Typography.Text
                  strong
                  style={{ display: 'block', fontSize: 15 }}
                  ellipsis={{ tooltip: user.name }}
                >
                  {user.name || 'Unnamed user'}
                </Typography.Text>
                <Typography.Text
                  type="secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                  }}
                  ellipsis={{ tooltip: user.email }}
                >
                  <MailOutlined style={{ fontSize: 12 }} />
                  {user.email}
                </Typography.Text>
                {user.organization && (
                  <Typography.Text
                    type="secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                    }}
                    ellipsis={{ tooltip: user.organization }}
                  >
                    <BankOutlined style={{ fontSize: 12 }} />
                    {user.organization}
                  </Typography.Text>
                )}
                {user.uuid && (
                  <Typography.Text
                    type="secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                    }}
                    ellipsis={{ tooltip: user.uuid }}
                  >
                    <IdcardOutlined style={{ fontSize: 12 }} />
                    {user.uuid}
                  </Typography.Text>
                )}
              </div>
            </Card>
          )}
        />
      )}
    </div>
  );
}
