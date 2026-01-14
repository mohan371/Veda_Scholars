module.exports = {
  apps: [
    {
      name: "veda-backend",
      cwd: "./backend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 8483,
        NODE_OPTIONS: "--max-old-space-size=768", // Limit to 768MB for 2GB server
      },
      error_file: "./logs/backend-error.log",
      out_file: "./logs/backend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "800M", // Restart if exceeds 800MB (format: "800M" or 800000000)
      instances: 1,
      exec_mode: "fork",
      min_uptime: "10s",
      max_restarts: 10,
      kill_timeout: 5000,
    },
    {
      name: "veda-frontend",
      cwd: "./frontend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NODE_OPTIONS: "--max-old-space-size=1024", // Limit to 1GB for frontend
      },
      error_file: "./logs/frontend-error.log",
      out_file: "./logs/frontend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1200M", // Restart if exceeds 1.2GB (using M instead of G for compatibility)
      instances: 1,
      exec_mode: "fork",
      min_uptime: "10s",
      max_restarts: 10,
      kill_timeout: 5000,
    },
  ],
};
