import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/provider";

export default function UserPanel() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchUserStats();
        }
    }, [user]);

    const fetchUserStats = async () => {
        try {
            // Fetch username from profiles
            console.log('Fetching username from profiles for user:', user.id);
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error('❌ ERROR FETCHING PROFILE:', profileError);
                throw profileError;
            }
            console.log('✅ Profile data fetched:', profileData);

            // Fetch user stats
            console.log('Fetching user_stats for user:', user.id);
            const { data: statsData, error: statsError } = await supabase
                .from('user_stats')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (statsError) {
                console.error('❌ ERROR FETCHING USER_STATS:', statsError);
                // If no stats exist, create them
                if (statsError.code === 'PGRST116') {
                    console.log('No stats found, creating new stats...');
                    await createUserStats();
                    return;
                }
                throw statsError;
            }
            console.log('✅ User stats fetched:', statsData);

            // Combine both
            setStats({
                ...statsData,
                username: profileData?.username || 'Hero'
            });
            console.log('✅ Final stats set:', { ...statsData, username: profileData?.username });
        } catch (error) {
            console.error('❌ FINAL ERROR in fetchUserStats:', error);
            // Set default stats if none exist
            setStats({
                level: 1,
                exp: 0,
                exp_to_next: 100,
                current_hp: 100,
                max_hp: 100,
                physical_attack: 10,
                physical_defense: 5,
                magical_attack: 8,
                magical_defense: 4,
                crit_rate: 5,
                action_points: 0,
                username: 'Hero'
            });
        } finally {
            setLoading(false);
        }
    };

    const createUserStats = async () => {
        try {
            const initialStats = {
                user_id: user.id,
                level: 1,
                exp: 0,
                exp_to_next: 100,
                current_hp: 100,
                max_hp: 100,
                physical_attack: 10,
                physical_defense: 5,
                magical_attack: 8,
                magical_defense: 4,
                crit_rate: 5,
                action_points: 0
            };

            const { error } = await supabase
                .from('user_stats')
                .insert([initialStats]);

            if (error) throw error;

            // Fetch the newly created stats
            await fetchUserStats();
        } catch (error) {
            console.error('Error creating user stats:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '30px',
                marginBottom: '30px',
                color: 'white',
                textAlign: 'center'
            }}>
                Loading stats...
            </div>
        );
    }

    if (!stats) return null;

    const hpPercentage = (stats.current_hp / stats.max_hp) * 100;
    const expPercentage = (stats.exp / stats.exp_to_next) * 100;

    return (
        <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '30px',
            color: 'white',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
        }}>
            {/* Header */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '20px'
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.username || 'Hero'}</h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                        Level {stats.level} Adventurer
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>⚡ {stats.action_points} AP</div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>Action Points</div>
                </div>
            </div>

            {/* HP Bar */}
            <div style={{ marginBottom: '15px' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    marginBottom: '5px'
                }}>
                    <span>❤️ HP: {stats.current_hp} / {stats.max_hp}</span>
                </div>
                <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${hpPercentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #ff006e, #ff4d9d)',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
            </div>

            {/* EXP Bar */}
            <div style={{ marginBottom: '25px' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    marginBottom: '5px'
                }}>
                    <span>📊 EXP: {stats.exp} / {stats.exp_to_next}</span>
                </div>
                <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${expPercentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #06ffa5, #00d4ff)',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px'
            }}>
                {/* P.ATK */}
                <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: '15px',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
                        ⚔️ P.ATK
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.physical_attack}</div>
                </div>

                {/* P.DEF */}
                <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: '15px',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
                        🛡️ P.DEF
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.physical_defense}</div>
                </div>

                {/* M.ATK */}
                <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: '15px',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
                        ✨ M.ATK
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.magical_attack}</div>
                </div>

                {/* M.DEF */}
                <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: '15px',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
                        💎 M.DEF
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.magical_defense}</div>
                </div>

                {/* CRIT */}
                <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: '15px',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
                        ⚡ CRIT
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.crit_rate}%</div>
                </div>

                {/* Skills */}
                <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: '15px',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
                        🎯 Skills
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>1</div>
                </div>
            </div>
        </div>
    );
}
