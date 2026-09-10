import React, { useState } from 'react';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
}

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [];

export const AdminAuditPage: React.FC = () => {
  const [logs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      !searchQuery ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = selectedModule === 'ALL' || log.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
          Nhật Ký Hoạt Động (System Audit Log)
        </h2>
        <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Ghi nhận lịch sử các sự kiện bảo mật, thao tác tài khoản và lượt thực hành hệ thống
        </p>
      </div>

      {/* Filter Bar */}
      <div
        className="p-4 rounded-xl border flex flex-col sm:flex-row gap-3 items-center justify-between"
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex-1 w-full flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm sự kiện, tên người dùng hoặc mô tả..."
            className="w-full bg-transparent text-xs font-medium focus:outline-none"
            style={{ color: 'var(--text-main)' }}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <span className="text-xs opacity-60 font-semibold">Phân loại Mô-đun:</span>
          <select
            value={selectedModule}
            onChange={e => setSelectedModule(e.target.value)}
            className="p-1.5 px-2.5 rounded-lg border text-xs font-semibold focus:outline-none cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            <option value="ALL">Tất cả Mô-đun</option>
            <option value="USER_MGMT">Quản Lý Người Dùng</option>
            <option value="CLASS_ASSIGN">Giao Bài Tập</option>
            <option value="LAB_ENGINE">Phòng Lab Mô Phỏng</option>
            <option value="LAB_CATALOG">Kho Lab Hệ Thống</option>
          </select>
        </div>
      </div>

      {/* Full-width Audit Log Table */}
      <div
        className="border rounded-xl overflow-hidden shadow-xs"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <table className="w-full text-left text-xs">
          <thead
            className="border-b uppercase font-semibold text-[10px] tracking-wider"
            style={{
              backgroundColor: 'var(--bg-panel)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-muted)',
            }}
          >
            <tr>
              <th className="p-3.5 pl-4">Thời Gian</th>
              <th className="p-3.5">Người Thực Hiện</th>
              <th className="p-3.5">Vai Trò</th>
              <th className="p-3.5">Hành Động / Sự Kiện</th>
              <th className="p-3.5 text-right pr-4">Mô-Đun</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {filteredLogs.map(log => (
              <tr
                key={log.id}
                className="hover:bg-slate-500/5 transition-colors"
                style={{ backgroundColor: 'var(--bg-main)' }}
              >
                <td className="p-3.5 pl-4 font-mono text-[11px] opacity-75">{log.timestamp}</td>
                <td className="p-3.5 font-bold text-xs">{log.user}</td>
                <td className="p-3.5">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md border"
                    style={{
                      backgroundColor: 'var(--bg-panel)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    [{log.role}]
                  </span>
                </td>
                <td className="p-3.5 font-medium opacity-90">{log.action}</td>
                <td className="p-3.5 text-right pr-4 font-mono text-[10px] opacity-60">
                  {log.module}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
