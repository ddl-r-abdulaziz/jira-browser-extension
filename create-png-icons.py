#!/usr/bin/env python3
import base64
import os

# Simple PNG data for basic icons (minimal 16x16, 32x32, 48x48, 128x128)
# These are actual PNG files encoded as base64

# Minimal blue circle with white "J" PNG data
icon_data = {
    16: '''iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAAF5JREFUOI3t0rEJwzAURdGjwAu4cBdpXKWRyjSQylW6cBcu3EGKFPBfIpBCghTJn8LFBRduwSV/wOpJcKg3xsaV4FAXN4YGh9aGMCsz4Zoh4f7PJE4rPZIzJb7j+d0KbAB7LmV8WQAAAABJRU5ErkJggg==''',
    
    32: '''iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAAKlJREFUWIXt1jEOwzAIBVAfEQ+QJldol05d0qlLp3TKlEudckReIFc4Q15gOzEhEJ1aKRJfSP4w+PNnwD8fwBhjjDHGGGOM/fsBp+uhEsD+fjqVAHKfhkoAu9u+HcDud6gE8AEIb1kLYLTbl2qBPOTX6wFs9jdUA1h2dasa0AJQ/lf7KAK0AJT/1T6KAC0A5X+1jyJAC0D5X+2jCNACUP5X+ygCtACU/9U+igAtAOV/tY8iwA/QWV0jWnc4VgAAAABJRU5ErkJggg==''',
    
    48: '''iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAANVJREFUaIHt2jEOwzAIBVAfEQ+QJldol05d0qlLp3TKlEudckReIFc4Q15gOzEhEJ1aKRJfSP4w+PNnwD8fwBhjjDHGGGOM/a8PqJddJ4DdblsOYLPeFgN4/34cB/D8es0AyPSjRfJVl8yX6ctP5gJAVhAkc3uW8ZIzAaR+tEi+6pL5Mn35yVwAyAqCZG7PMl5yJoDUjxbJV10yX6YvP5kLAFlBkMztWcZLzgSQ+tEi+apL5sv05SdzASArCJK5Pct4yZkAUj9aJF91yXyZvvxkLgBkBUEyt2cZLzkT4As1m21xmI2F7QAAAABJRU5ErkJggg==''',
    
    128: '''iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAAUtJREFUeJzt3TGOxCAQRFGfkBPIyTlBTpAT5OS5gLlATiAnkJNzApFI+Ads02J+AJV0s1otUUhVQPgHP3/AfylQkx+YgRmYgRn4rwPe397LAVzPpzqAs9tHOYCz21c5gA9A+JOdAKLdPsoB7G4f5QA+AIiS5Jlm8QyHZAKMBqBIhNIArL7yg0OAwQCUSFAawOorPzgEGAxAiQSlAay+8oNDgMEAlEhQGsDqKz84BBgMQIkEpQGsvvKDQ4DBAJRIUBrA6is/OAQYDECJBKUBrL7yg0OAwQCUSFAawOorPzgEGAxAiQSlAay+8oNDgMEAlEhQGsDqKz84BBgMQIkEpQGsvvKDQ4DBAJRIUBrA6is/OAQYDECJBKUBrL7yg0OAwQCUSFAawOorPzgEGAxAiQSlAay+8oNDgMEAlEhQGsDqKz84BBgMQIkEpQGsvvKDQ4DBAJRIUBrAD9lV3QIBhPhgAAAAAElFTkSuQmCC'''
}

# Create icons directory if it doesn't exist
if not os.path.exists('icons'):
    os.makedirs('icons')

# Generate PNG files
for size, data in icon_data.items():
    png_data = base64.b64decode(data)
    with open(f'icons/icon{size}.png', 'wb') as f:
        f.write(png_data)
    print(f'Created icons/icon{size}.png')

print('PNG icons created successfully!')