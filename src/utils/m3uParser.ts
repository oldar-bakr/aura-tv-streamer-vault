
export interface ParsedChannel {
  name: string;
  url: string;
  logo?: string;
  group?: string;
  language?: string;
  country?: string;
}

export const parseM3U = (content: string): ParsedChannel[] => {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  const channels: ParsedChannel[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('#EXTINF:')) {
      const nextLine = lines[i + 1];
      if (nextLine && !nextLine.startsWith('#')) {
        const channel = parseExtInf(line, nextLine);
        if (channel) {
          channels.push(channel);
        }
        i++; // Skip the URL line as we've processed it
      }
    }
  }
  
  return channels;
};

const parseExtInf = (extinfLine: string, urlLine: string): ParsedChannel | null => {
  try {
    // Extract the title (last part after commas)
    const titleMatch = extinfLine.match(/,(.+)$/);
    const name = titleMatch ? titleMatch[1].trim() : 'Unknown Channel';
    
    // Extract attributes using regex
    const logoMatch = extinfLine.match(/tvg-logo="([^"]+)"/);
    const groupMatch = extinfLine.match(/group-title="([^"]+)"/);
    const languageMatch = extinfLine.match(/tvg-language="([^"]+)"/);
    const countryMatch = extinfLine.match(/tvg-country="([^"]+)"/);
    
    return {
      name,
      url: urlLine.trim(),
      logo: logoMatch ? logoMatch[1] : undefined,
      group: groupMatch ? groupMatch[1] : 'General',
      language: languageMatch ? languageMatch[1] : undefined,
      country: countryMatch ? countryMatch[1] : undefined,
    };
  } catch (error) {
    console.error('Error parsing EXTINF line:', error);
    return null;
  }
};

export const fetchM3U = async (url: string): Promise<ParsedChannel[]> => {
  try {
    console.log('Fetching M3U from URL:', url);
    
    // Use a CORS proxy for external M3U files
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.contents;
    
    console.log('M3U content fetched, parsing...');
    const channels = parseM3U(content);
    console.log(`Parsed ${channels.length} channels`);
    
    return channels;
  } catch (error) {
    console.error('Error fetching M3U:', error);
    throw error;
  }
};
