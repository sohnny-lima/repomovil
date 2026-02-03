import {
  Folder,
  Book,
  Video,
  Music,
  Clock,
  Link,
  Star,
  Heart,
  School,
  Globe,
} from 'lucide-react';

/**
 * Map iconKey strings to Lucide React icon components
 * Matches the icon keys used in the mobile app
 */
export const iconMap = {
  folder: Folder,
  book: Book,
  video: Video,
  music: Music,
  clock: Clock,
  link: Link,
  star: Star,
  heart: Heart,
  school: School,
  earth: Globe,
};

/**
 * Get icon component for a given iconKey
 * @param {string} iconKey - The icon key from the database
 * @returns {Component} Lucide icon component
 */
export const getIcon = (iconKey) => {
  return iconMap[iconKey] || Link; // Default to Link icon
};

/**
 * Get all available icon keys for selection
 * @returns {Array} Array of icon key strings
 */
export const getAvailableIcons = () => {
  return Object.keys(iconMap);
};
