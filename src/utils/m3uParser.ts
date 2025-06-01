
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
  
  console.log('Parsing M3U content, total lines:', lines.length);
  console.log('First 10 lines:', lines.slice(0, 10));
  
  // Check if content is an error message
  if (content.includes('400: Invalid request') || 
      content.includes('Invalid URL') || 
      content.includes('<HTML>') ||
      content.includes('error') ||
      lines.length < 2) {
    console.log('Detected invalid content or error response');
    throw new Error('Invalid M3U content: The URL returned an error or invalid response');
  }
  
  // Handle different M3U formats
  if (content.includes('#EXT-X-VERSION') || content.includes('#EXT-X-TARGETDURATION')) {
    // This is an M3U8 HLS playlist, not a channel list
    console.log('Detected HLS playlist format, extracting single stream');
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
          console.log('Parsed channel:', channel.name);
        }
        i++; // Skip the URL line as we've processed it
      }
    } else if (line.startsWith('http') && !line.includes('#EXT')) {
      // Handle simple URL lists without EXTINF
      const simpleChannel = {
        name: `Channel ${channels.length + 1}`,
        url: line,
        group: 'General'
      };
      channels.push(simpleChannel);
      console.log('Parsed simple URL channel:', simpleChannel.name);
    }
  }
  
  console.log(`Total channels parsed: ${channels.length}`);
  
  if (channels.length === 0) {
    throw new Error('No valid channels found in M3U content');
  }
  
  return channels;
};

const parseHLSPlaylist = (content: string, lines: string[]): ParsedChannel[] => {
  // Extract stream URLs from HLS playlist
  const streamUrls = lines.filter(line => 
    line.startsWith('http') && 
    (line.includes('.m3u8') || line.includes('.ts'))
  );
  
  if (streamUrls.length > 0) {
    return [{
      name: 'Live Stream',
      url: streamUrls[0], // Use the first available stream
      group: 'Live'
    }];
  }
  
  return [];
};

const parseExtInf = (extinfLine: string, urlLine: string): ParsedChannel | null => {
  try {
    console.log('Parsing EXTINF:', extinfLine);
    
    // Extract the title (last part after commas)
    const titleMatch = extinfLine.match(/,(.+)$/);
    const name = titleMatch ? titleMatch[1].trim() : 'Unknown Channel';
    
    // Extract attributes using regex
    const logoMatch = extinfLine.match(/tvg-logo="([^"]+)"/);
    const groupMatch = extinfLine.match(/group-title="([^"]+)"/);
    const languageMatch = extinfLine.match(/tvg-language="([^"]+)"/);
    const countryMatch = extinfLine.match(/tvg-country="([^"]+)"/);
    
    const channel = {
      name,
      url: urlLine.trim(),
      logo: logoMatch ? logoMatch[1] : undefined,
      group: groupMatch ? groupMatch[1] : 'General',
      language: languageMatch ? languageMatch[1] : undefined,
      country: countryMatch ? countryMatch[1] : undefined,
    };
    
    console.log('Successfully parsed channel:', channel);
    return channel;
  } catch (error) {
    console.error('Error parsing EXTINF line:', error);
    return null;
  }
};

export const fetchM3U = async (url: string): Promise<ParsedChannel[]> => {
  try {
    console.log('Fetching M3U from URL:', url);
    
    // Try multiple CORS proxies in order of preference
    const corsProxies = [
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      `https://cors-anywhere.herokuapp.com/${url}`,
    ];
    
    let content = '';
    let lastError = null;
    
    for (const proxyUrl of corsProxies) {
      try {
        console.log('Trying proxy:', proxyUrl);
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Handle different proxy response formats
        if (proxyUrl.includes('allorigins.win')) {
          const data = await response.json();
          content = data.contents;
        } else {
          content = await response.text();
        }
        
        if (content && content.trim()) {
          console.log('Successfully fetched M3U content');
          console.log('Content preview:', content.substring(0, 500));
          break;
        }
      } catch (error) {
        console.log('Proxy failed:', proxyUrl, error);
        lastError = error;
        continue;
      }
    }
    
    if (!content || !content.trim()) {
      throw lastError || new Error('All CORS proxies failed');
    }
    
    console.log('M3U content fetched, parsing...');
    const channels = parseM3U(content);
    console.log(`Parsed ${channels.length} channels`);
    
    return channels;
  } catch (error) {
    console.error('Error fetching M3U:', error);
    throw error;
  }
};
