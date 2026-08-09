module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.GITHUB_PAT;
  if (!token) {
    return res.status(500).json({ error: 'GITHUB_PAT environment variable is not set in Vercel.' });
  }

  const { path, data } = req.body;
  if (!path || !data) {
    return res.status(400).json({ error: 'Missing path or data' });
  }

  const repoOwner = 'Dev-Incognito';
  const repoName = 'astha-patel-portfolio';
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`;

  try {
    // 1. Get the current file's SHA (required by GitHub API to update a file)
    const getRes = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Vercel-Serverless-Function'
      }
    });

    if (!getRes.ok) {
      const errText = await getRes.text();
      return res.status(getRes.status).json({ error: `Failed to fetch existing file: ${errText}` });
    }

    const getJson = await getRes.json();
    const sha = getJson.sha;

    // 2. Encode the new content in base64
    const contentString = JSON.stringify(data, null, 2);
    const encodedContent = Buffer.from(contentString, 'utf-8').toString('base64');

    // 3. Make the PUT request to update the file
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Vercel-Serverless-Function'
      },
      body: JSON.stringify({
        message: `Admin Panel: Update ${path}`,
        content: encodedContent,
        sha: sha
      })
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      return res.status(putRes.status).json({ error: `Failed to update file: ${errText}` });
    }

    return res.status(200).json({ success: true, message: 'File updated successfully' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
