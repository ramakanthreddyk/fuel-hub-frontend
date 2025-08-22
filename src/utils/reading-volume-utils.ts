/**
 * @file reading-volume-utils.ts
 * @description Utility functions for reading volume calculations
 */

export function calculateVolumeDifference(currentReading: number, previousReading: number) {
  return currentReading - previousReading;
}

export function isLargeVolumeJump(difference: number, previousReading: number) {
  return difference > previousReading * 0.2;
}
