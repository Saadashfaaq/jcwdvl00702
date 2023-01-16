module.exports = {
  apps: [
    {
      name: "JCWDVL-007-02", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8702,
      },
      time: true,
    },
  ],
};
