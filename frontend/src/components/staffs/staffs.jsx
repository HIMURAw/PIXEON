import React, { useState, useEffect } from 'react';
import './staffs.scss';

const Staffs = () => {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

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
        },
        {
            id: '6',
            username: 'Community Manager',
            displayName: 'Community Manager',
            avatar: 'https://cdn.discordapp.com/embed/avatars/5.png',
            role: 'Community Manager',
            roleColor: '#e67e22',
            status: 'online',
            joinedAt: '2023-06-08',
            description: 'Topluluk yöneticisi ve iletişim sorumlusu'
        },
        {
            id: '7',
            username: 'Security',
            displayName: 'Security',
            avatar: 'https://cdn.discordapp.com/embed/avatars/6.png',
            role: 'Security',
            roleColor: '#c0392b',
            status: 'idle',
            joinedAt: '2023-07-15',
            description: 'Güvenlik ve moderasyon sorumlusu'
        },
        {
            id: '8',
            username: 'Content Creator',
            displayName: 'Content Creator',
            avatar: 'https://cdn.discordapp.com/embed/avatars/7.png',
            role: 'Content Creator',
            roleColor: '#8e44ad',
            status: 'online',
            joinedAt: '2023-08-20',
            description: 'İçerik üreticisi ve medya sorumlusu'
        },
        {
            id: '9',
            username: 'Technical Support',
            displayName: 'Technical Support',
            avatar: 'https://cdn.discordapp.com/embed/avatars/8.png',
            role: 'Technical Support',
            roleColor: '#27ae60',
            status: 'dnd',
            joinedAt: '2023-09-10',
            description: 'Teknik destek ve sorun giderme uzmanı'
        },
        {
            id: '10',
            username: 'Translator',
            displayName: 'Translator',
            avatar: 'https://cdn.discordapp.com/embed/avatars/9.png',
            role: 'Translator',
            roleColor: '#2980b9',
            status: 'online',
            joinedAt: '2023-10-05',
            description: 'Çevirmen ve dil desteği sorumlusu'
        },
        {
            id: '11',
            username: 'Helper',
            displayName: 'Helper',
            avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
            role: 'Helper',
            roleColor: '#16a085',
            status: 'idle',
            joinedAt: '2023-11-12',
            description: 'Yardımcı ve yeni üye rehberi'
        },
        {
            id: '12',
            username: 'VIP',
            displayName: 'VIP',
            avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
            role: 'VIP',
            roleColor: '#f1c40f',
            status: 'online',
            joinedAt: '2023-12-01',
            description: 'VIP üye ve özel destek sorumlusu'
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

    // Sayfalama hesaplamaları
    const totalPages = Math.ceil(staffs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStaffs = staffs.slice(startIndex, endIndex);

    // Sayfa değiştirme fonksiyonları
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                {currentStaffs.map((staff) => (
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

            {/* Sayfalama Butonları */}
            {staffs.length > itemsPerPage && (
                <div className="pagination">
                    <div className="pagination-info">
                        <span>
                            Sayfa {currentPage} / {totalPages}
                            ({startIndex + 1}-{Math.min(endIndex, staffs.length)} / {staffs.length} staff)
                        </span>
                    </div>

                    <div className="pagination-controls">
                        <button
                            className="pagination-btn prev-btn"
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                        >
                            <span>‹</span>
                            Önceki
                        </button>

                        <div className="page-numbers">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                                <button
                                    key={pageNumber}
                                    className={`page-number ${pageNumber === currentPage ? 'active' : ''}`}
                                    onClick={() => goToPage(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                        </div>

                        <button
                            className="pagination-btn next-btn"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Sonraki
                            <span>›</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staffs;
