import TrainingController from "../../other/TrainingController";

export const START_TRAINING = "START_TRAINING";
export const STOP_TRAINING = "STOP_TRAINING";
export const TRAINING_PROGRESS = "TRAINING_PROGRESS";

export const startedTraining = ({
  network,
  server,
  dataset,
  trainingParams,
}) => ({
  type: START_TRAINING,
  network,
  server,
  dataset,
  trainingParams,
});

export const stoppedTraining = ({ network, server }) => ({
  type: STOP_TRAINING,
  network,
  server,
});

export const trainingProgress = ({
  server,
  epoch,
  err,
  accuracy,
  learningRate,
  network,
}) => ({
  type: TRAINING_PROGRESS,
  epoch,
  err,
  accuracy,
  learningRate,
  server,
  network,
});

export const startTraining = ({
  server,
  network,
  dataset,
  trainingParams,
  dispatch,
}) => {
  const trainingInstance = new TrainingController({
    server,
    network,
    dataset,
    trainingParams,
  });
  trainingInstance.addEventListener("start", () => {
    dispatch(startedTraining({ network, server, dataset, trainingParams }));
  });
  trainingInstance.addEventListener("end", () => {
    dispatch(stoppedTraining({ network, server }));
  });
  trainingInstance.addEventListener(
    "batchProgress",
    (epoch, accuracy, err, learningRate) => {
      dispatch(
        trainingProgress({
          epoch,
          err,
          accuracy,
          learningRate,
          server,
          network,
        })
      );
    }
  );
  trainingInstance.startLearning();
};