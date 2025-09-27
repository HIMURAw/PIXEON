import React, { useState, useEffect } from 'react';
import './staffs.scss';

const Staffs = () => {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data - gerçek uygulamada Discord API'den gelecek
    const mockStaffs = [
        {
            id: '1',
            username: 'Admin',
            displayName: 'Admin',
            avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
            role: 'Administrator',
            roleColor: '#e74c3c',
            status: 'online',
            joinedAt: '2023-01-15',
            description: 'Sunucu yöneticisi ve kurucusu'
        },
        {
            id: '2',
            username: 'Moderator',
            displayName: 'Moderator',
            avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
            role: 'Moderator',
            roleColor: '#3498db',
            status: 'online',
            joinedAt: '2023-02-20',
            description: 'Topluluk moderatörü'
        },
        {
            id: '3',
            username: 'Developer',
            displayName: 'Developer',
            avatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
            role: 'Developer',
            roleColor: '#9b59b6',
            status: 'idle',
            joinedAt: '2023-03-10',
            description: 'Bot ve web sitesi geliştiricisi'
        },
        {
            id: '4',
            username: 'Support',
            displayName: 'Support',
            avatar: 'https://cdn.discordapp.com/embed/avatars/3.png',
            role: 'Support',
            roleColor: '#2ecc71',
            status: 'dnd',
            joinedAt: '2023-04-05',
            description: 'Kullanıcı desteği sorumlusu'
        },
        {
            id: '5',
            username: 'Event Manager',
            displayName: 'Event Manager',
            avatar: 'https://cdn.discordapp.com/embed/avatars/4.png',
            role: 'Event Manager',
            roleColor: '#f39c12',
            status: 'online',
            joinedAt: '2023-05-12',
            description: 'Etkinlik ve organizasyon sorumlusu'
        }
    ];

    useEffect(() => {
        // Simüle edilmiş API çağrısı
        const fetchStaffs = async () => {
            setLoading(true);
            try {
                // Gerçek uygulamada burada Discord API çağrısı yapılacak
                // const response = await fetch('/api/discord/staff');
                // const data = await response.json();

                // Şimdilik mock data kullanıyoruz
                setTimeout(() => {
                    setStaffs(mockStaffs);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Staff verileri yüklenirken hata:', error);
                setLoading(false);
            }
        };

        fetchStaffs();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'online':
                return '🟢';
            case 'idle':
                return '🟡';
            case 'dnd':
                return '🔴';
            default:
                return '⚫';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'online':
                return 'Çevrimiçi';
            case 'idle':
                return 'Boşta';
            case 'dnd':
                return 'Rahatsız Etme';
            default:
                return 'Çevrimdışı';
        }
    };

    if (loading) {
        return (
            <div className="staffs-container">
                <div className="staffs-header">
                    <h2>Sunucu Kadrosu</h2>
                    <p>Discord sunucumuzun yönetici kadrosu</p>
                </div>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Staff bilgileri yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="staffs-container">
            <div className="staffs-header">
                <h2>Sunucu Kadrosu</h2>
                <p>Discord sunucumuzun yönetici kadrosu</p>
            </div>

            <div className="staffs-grid">
                {staffs.map((staff) => (
                    <div key={staff.id} className="staff-card">
                        <div className="staff-avatar-container">
                            <img
                                src={staff.avatar}
                                alt={staff.displayName}
                                className="staff-avatar"
                            />
                            <div className={`status-indicator ${staff.status}`}>
                                {getStatusIcon(staff.status)}
                            </div>
                        </div>

                        <div className="staff-info">
                            <div className="staff-name">
                                <h3>{staff.displayName}</h3>
                                <span className="staff-role" style={{ color: staff.roleColor }}>
                                    {staff.role}
                                </span>
                            </div>

                            <div className="staff-details">
                                <p className="staff-description">{staff.description}</p>

                                <div className="staff-meta">
                                    <div className="meta-item">
                                        <span className="meta-label">Durum:</span>
                                        <span className="meta-value">{getStatusText(staff.status)}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">Katılım:</span>
                                        <span className="meta-value">{new Date(staff.joinedAt).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {staffs.length === 0 && (
                <div className="no-staffs">
                    <p>Henüz staff bilgisi bulunamadı.</p>
                </div>
            )}
        </div>
    );
};

export default Staffs;
