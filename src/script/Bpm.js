const math = require ('mathjs');

function detectRPeaks (ecgData, threshold = 0.5) {
  let rPeaks = [];
  for (let i = 1; i < ecgData.length - 1; i++) {
    if (
      ecgData[i] > threshold &&
      ecgData[i] > ecgData[i - 1] &&
      ecgData[i] > ecgData[i + 1]
    ) {
      rPeaks.push (i);
    }
  }
  return rPeaks;
}

function calculateBPM (ecgData, samplingRate = 200) {
  const rPeaks = detectRPeaks (ecgData);

  if (rPeaks.length < 2) {
    return 0;
  }

  let rrIntervals = [];
  for (let i = 1; i < rPeaks.length; i++) {
    rrIntervals.push ((rPeaks[i] - rPeaks[i - 1]) / samplingRate);
  }

  let bpm = rrIntervals.map (interval => 60 / interval);
  let averageBPM = math.mean (bpm);
  return averageBPM;
}

module.exports = {calculateBPM};
