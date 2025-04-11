function calculateHeartRate (ecgData, samplingRate = 200) {
  const filtered = movingAverageFilter (ecgData, 5);
  const peaks = findRPeaks (filtered, samplingRate);
  const rrIntervals = calculateRRIntervals (peaks, samplingRate);
  const bpm = calculateAverageBPM (rrIntervals);
  return bpm;
}

function movingAverageFilter (data, windowSize = 5) {
  const result = [];
  for (let i = 0; i < data.length - windowSize + 1; i++) {
    let sum = 0;
    for (let j = 0; j < windowSize; j++) {
      sum += data[i + j];
    }
    result.push (sum / windowSize);
  }
  return result;
}

function findRPeaks (ecgData, samplingRate = 200) {
  const peaks = [];
  const threshold = 0.6 * Math.max (...ecgData);
  let lastPeakIndex = -Infinity;
  const minDistance = Math.floor (0.3 * samplingRate);

  for (let i = 1; i < ecgData.length - 1; i++) {
    if (
      ecgData[i] > threshold &&
      ecgData[i] > ecgData[i - 1] &&
      ecgData[i] > ecgData[i + 1] &&
      i - lastPeakIndex > minDistance
    ) {
      peaks.push (i);
      lastPeakIndex = i;
    }
  }

  return peaks;
}

function calculateRRIntervals (peaks, samplingRate = 200) {
  const rrIntervals = [];
  for (let i = 1; i < peaks.length; i++) {
    const rr = (peaks[i] - peaks[i - 1]) / samplingRate;
    rrIntervals.push (rr);
  }
  return rrIntervals;
}

function calculateAverageBPM (rrIntervals) {
  if (rrIntervals.length === 0) return 0;
  const averageRR =
    rrIntervals.reduce ((a, b) => a + b, 0) / rrIntervals.length;
  return 60 / averageRR;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateHeartRate,
  };
}
