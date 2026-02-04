#!/usr/bin/env python3
"""
YouTube Subtitle Extractor Script
Extracts subtitles/transcripts from YouTube videos given a URL.

Usage:
    python3 extract_subtitles.py <youtube_url> [--format FORMAT] [--lang LANG] [--translate-to LANG] [--output FILE]

Examples:
    python3 extract_subtitles.py "https://www.youtube.com/watch?v=VIDEO_ID"
    python3 extract_subtitles.py "https://youtu.be/VIDEO_ID" --format srt
    python3 extract_subtitles.py "https://youtu.be/VIDEO_ID" --format json --output subs.json
    python3 extract_subtitles.py "https://youtu.be/VIDEO_ID" --lang vi
    python3 extract_subtitles.py "https://youtu.be/VIDEO_ID" --translate-to vi
"""

import argparse
import json
import re
import sys
from typing import Optional

try:
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api.formatters import TextFormatter, SRTFormatter, JSONFormatter
except ImportError:
    print("Error: youtube-transcript-api is not installed.")
    print("Install it with: pip3 install youtube-transcript-api")
    sys.exit(1)


def extract_video_id(url: str) -> Optional[str]:
    """Extract YouTube video ID from various URL formats."""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
        r'^([a-zA-Z0-9_-]{11})$'  # Direct video ID
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def get_transcript(video_id: str, language: Optional[str] = None, translate_to: Optional[str] = None):
    """
    Fetch transcript for a video.
    
    Args:
        video_id: YouTube video ID
        language: Preferred language code (e.g., 'en', 'vi')
        translate_to: Target language for translation
    
    Returns:
        Transcript data as a list of dictionaries
    """
    api = YouTubeTranscriptApi()
    transcript_list = api.list(video_id)
    
    # Priority: requested language -> manual -> auto-generated
    languages_to_try = []
    if language:
        languages_to_try.append(language)
    languages_to_try.extend(['en', 'vi'])  # Default fallbacks
    
    transcript = None
    for lang in languages_to_try:
        try:
            transcript = transcript_list.find_transcript([lang])
            break
        except Exception:
            continue
    
    if transcript is None:
        # Get first available transcript
        available = list(transcript_list)
        if available:
            transcript = available[0]
        else:
            raise Exception("No transcripts available for this video")
    
    # Translate if requested
    if translate_to and transcript.language_code != translate_to:
        try:
            transcript = transcript.translate(translate_to)
        except Exception as e:
            print(f"Warning: Translation to '{translate_to}' failed: {e}", file=sys.stderr)
    
    return transcript.fetch()


def format_transcript(transcript_data, output_format: str = 'text') -> str:
    """Format transcript data based on the requested format."""
    formatters = {
        'text': TextFormatter(),
        'srt': SRTFormatter(),
        'json': JSONFormatter()
    }
    
    formatter = formatters.get(output_format.lower())
    if formatter is None:
        raise ValueError(f"Unsupported format: {output_format}. Use: text, srt, or json")
    
    return formatter.format_transcript(transcript_data)


def main():
    parser = argparse.ArgumentParser(
        description='Extract subtitles from YouTube videos',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  %(prog)s "https://youtu.be/dQw4w9WgXcQ" --format srt
  %(prog)s "https://youtu.be/dQw4w9WgXcQ" --lang vi
  %(prog)s "https://youtu.be/dQw4w9WgXcQ" --translate-to vi
  %(prog)s "https://youtu.be/dQw4w9WgXcQ" --format json --output subtitles.json
        """
    )
    parser.add_argument('url', help='YouTube video URL or video ID')
    parser.add_argument('--format', '-f', choices=['text', 'srt', 'json'], 
                        default='text', help='Output format (default: text)')
    parser.add_argument('--lang', '-l', help='Preferred transcript language code')
    parser.add_argument('--translate-to', '-t', help='Translate to target language')
    parser.add_argument('--output', '-o', help='Output file (default: stdout)')
    
    args = parser.parse_args()
    
    # Extract video ID
    video_id = extract_video_id(args.url)
    if not video_id:
        print(f"Error: Could not extract video ID from: {args.url}", file=sys.stderr)
        sys.exit(1)
    
    try:
        # Fetch transcript
        transcript_data = get_transcript(video_id, args.lang, args.translate_to)
        
        # Format output
        output = format_transcript(transcript_data, args.format)
        
        # Write output
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                f.write(output)
            print(f"Subtitles saved to: {args.output}", file=sys.stderr)
        else:
            print(output)
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
