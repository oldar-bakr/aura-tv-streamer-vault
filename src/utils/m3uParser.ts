
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
  
  console.log('Parsing M3U content for Medoil IPTV, total lines:', lines.length);
  
  // Check if content is valid
  if (content.includes('400: Invalid request') || 
      content.includes('Invalid URL') || 
      content.includes('<HTML>') ||
      content.includes('<html>') ||
      content.includes('<!DOCTYPE') ||
      content.includes('error') ||
      lines.length < 2) {
    throw new Error('Invalid M3U content: The URL returned an error or invalid response');
  }
  
  // Handle HLS playlists
  if (content.includes('#EXT-X-VERSION') || content.includes('#EXT-X-TARGETDURATION')) {
    return parseHLSPlaylist(content, lines);
  }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('#EXTINF:')) {
      const nextLine = lines[i + 1];
      if (nextLine && !nextLine.startsWith('#')) {
        const channel = parseExtInf(line, nextLine);
        if (channel) {
          channels.push(channel);
        }
        i++; // Skip the URL line
      }
    } else if (line.startsWith('http') && !line.includes('#EXT')) {
      // Handle simple URL lists
      const simpleChannel = {
        name: `Channel ${channels.length + 1}`,
        url: line,
        group: 'General'
      };
      channels.push(simpleChannel);
    }
  }
  
  console.log(`Medoil IPTV: Parsed ${channels.length} channels`);
  
  if (channels.length === 0) {
    throw new Error('No valid channels found in M3U content');
  }
  
  return channels;
};

const parseHLSPlaylist = (content: string, lines: string[]): ParsedChannel[] => {
  const streamUrls = lines.filter(line => 
    line.startsWith('http') && 
    (line.includes('.m3u8') || line.includes('.ts'))
  );
  
  if (streamUrls.length > 0) {
    return [{
      name: 'Live Stream',
      url: streamUrls[0],
      group: 'Live'
    }];
  }
  
  return [];
};

const parseExtInf = (extinfLine: string, urlLine: string): ParsedChannel | null => {
  try {
    // Extract the title (last part after commas)
    const titleMatch = extinfLine.match(/,(.+)$/);
    const name = titleMatch ? titleMatch[1].trim() : 'Unknown Channel';
    
    // Extract attributes
    const logoMatch = extinfLine.match(/tvg-logo="([^"]+)"/i) || extinfLine.match(/logo="([^"]+)"/i);
    const groupMatch = extinfLine.match(/group-title="([^"]+)"/i) || extinfLine.match(/group="([^"]+)"/i);
    const languageMatch = extinfLine.match(/tvg-language="([^"]+)"/i) || extinfLine.match(/language="([^"]+)"/i);
    const countryMatch = extinfLine.match(/tvg-country="([^"]+)"/i) || extinfLine.match(/country="([^"]+)"/i);
    
    return {
      name: name.replace(/"/g, '').trim(),
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
    console.log('Medoil IPTV: Fetching M3U from URL:', url);
    
    // Validate URL format
    new URL(url);
    
    // Try multiple CORS proxies
    const corsProxies = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
    ];
    
    let content = '';
    let lastError = null;
    
    for (const proxyUrl of corsProxies) {
      try {
        console.log('Trying proxy:', proxyUrl);
        const response = await fetch(proxyUrl, {
          headers: {
            'User-Agent': 'Medoil-IPTV/1.0'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        if (proxyUrl.includes('allorigins.win')) {
          const data = await response.json();
          content = data.contents;
        } else {
          content = await response.text();
        }
        
        if (content && content.trim()) {
          console.log('Medoil IPTV: Successfully fetched M3U content');
          break;
        }
      } catch (error) {
        console.log('Proxy failed:', proxyUrl, error);
        lastError = error;
        continue;
      }
    }
    
    if (!content || !content.trim()) {
      throw lastError || new Error('All CORS proxies failed to fetch the M3U content');
    }
    
    const channels = parseM3U(content);
    console.log(`Medoil IPTV: Successfully parsed ${channels.length} channels`);
    
    return channels;
  } catch (error) {
    console.error('Medoil IPTV: Error fetching M3U:', error);
    throw error;
  }
};
