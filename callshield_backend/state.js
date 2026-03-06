// This file acts as the shared brain for your backend
let isMonitoring = true; // Defaults to ON

module.exports = {
    getMonitoringState: () => isMonitoring,
    setMonitoringState: (state) => {
        isMonitoring = state;
        console.log(`🛡️ CallShield AI Monitoring is now: ${isMonitoring ? 'ACTIVE 🟢' : 'PAUSED 🔴'}`);
    }
};