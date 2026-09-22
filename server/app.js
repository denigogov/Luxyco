import('./dist/main.js').catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
