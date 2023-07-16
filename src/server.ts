import app from './app';

// Configuração para reiniciar o servidor automaticamente quando houver alterações no código
if (process.env.NODE_ENV !== 'production') {
  const { default: runWithNodemon } = await import('ts-node');

  runWithNodemon(app);
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
