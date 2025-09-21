import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const APITest = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const testAPIs = async () => {
    setTesting(true);
    const results: any = {};

    try {
      // Test News API
      console.log('Testing News API...');
      const newsResponse = await fetch('https://nexus-search.onrender.com/api/searchNews?query=technology&limit=3');
      results.news = {
        status: newsResponse.status,
        ok: newsResponse.ok,
        data: newsResponse.ok ? await newsResponse.json() : await newsResponse.text()
      };

      // Test Images API
      console.log('Testing Images API...');
      const imagesResponse = await fetch('https://nexus-search.onrender.com/api/searchImages?query=technology&limit=3');
      results.images = {
        status: imagesResponse.status,
        ok: imagesResponse.ok,
        data: imagesResponse.ok ? await imagesResponse.json() : await imagesResponse.text()
      };

      // Test Videos API
      console.log('Testing Videos API...');
      const videosResponse = await fetch('https://nexus-search.onrender.com/api/youtube/search?query=technology&limit=3');
      results.videos = {
        status: videosResponse.status,
        ok: videosResponse.ok,
        data: videosResponse.ok ? await videosResponse.json() : await videosResponse.text()
      };

      // Test Music API (Gemini)
      console.log('Testing Music API...');
      const musicResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBgGGMjRi95r9IcSpLEUaF8EUIQ3bpHO50', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Search for music related to "technology". Return a JSON array of 3 music results with the following structure: [{"id": "unique_id", "title": "song_title", "artist": "artist_name", "album": "album_name", "url": "spotify_url", "thumbnail": "album_cover_url", "source": "Spotify", "duration": "3:45", "publishedAt": "2023-01-01"}]'
            }]
          }]
        })
      });
      results.music = {
        status: musicResponse.status,
        ok: musicResponse.ok,
        data: musicResponse.ok ? await musicResponse.json() : await musicResponse.text()
      };

    } catch (error) {
      console.error('API Test Error:', error);
      results.error = error;
    }

    setTestResults(results);
    setTesting(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Test</CardTitle>
          <CardDescription>Test all external APIs to verify they're working</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={testAPIs} disabled={testing}>
            {testing ? 'Testing APIs...' : 'Test All APIs'}
          </Button>
        </CardContent>
      </Card>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-4">
          {Object.entries(testResults).map(([api, result]: [string, any]) => (
            <Card key={api}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize">{api} API</CardTitle>
                  <Badge variant={result.ok ? "default" : "destructive"}>
                    {result.ok ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Status:</strong> {result.status}</p>
                  <p><strong>Response:</strong></p>
                  <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default APITest;
