import cors from 'cors';
import express from 'express';
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORIES_DIR = process.env.STORIES_DIR ?? join(__dirname, 'stories');
const PORT = Number(process.env.PORT ?? 3847);

const app = express();
app.use(cors());

app.get('/api/stories', async (_req, res) => {
  try {
    const files = await readdir(STORIES_DIR);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));
    const summaries = await Promise.all(
      jsonFiles.map(async (file) => {
        const raw = await readFile(join(STORIES_DIR, file), 'utf-8');
        const story = JSON.parse(raw);
        return {
          id: story.id,
          title: story.title,
          topic: story.topic,
          description: story.description,
          sortOrder: story.sortOrder ?? story.level,
          teaches: story.teaches,
          sourceRef: story.sourceRef,
          estimatedMinutes: story.estimatedMinutes,
          isFinale: story.isFinale,
        };
      }),
    );
    res.json(summaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list stories' });
  }
});

app.get('/api/stories/:id', async (req, res) => {
  try {
    const path = join(STORIES_DIR, `${req.params.id}.json`);
    const raw = await readFile(path, 'utf-8');
    res.json(JSON.parse(raw));
  } catch {
    res.status(404).json({ error: 'Story not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Koodisampo story server http://localhost:${PORT}`);
  console.log(`Stories directory: ${STORIES_DIR}`);
});
