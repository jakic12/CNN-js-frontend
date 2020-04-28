import TrainingController from "../../other/TrainingController";
import { setNetwork } from "./networks";

export const START_TRAINING = "START_TRAINING";
export const STOP_TRAINING = "STOP_TRAINING";
export const TRAINING_PROGRESS = "TRAINING_PROGRESS";

export const startedTraining = ({
  network,
  server,
  dataset,
  trainingParams,
  epochs,
  learningRate,
  trainingInstance,
}) => ({
  type: START_TRAINING,
  network,
  server,
  dataset,
  trainingParams,
  epochs,
  learningRate,
  trainingInstance,
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
  epochs,
}) => ({
  type: TRAINING_PROGRESS,
  epoch,
  err,
  accuracy,
  learningRate,
  server,
  network,
  epochs,
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
    dispatch(
      startedTraining({
        network,
        server,
        dataset,
        trainingParams,
        learningRate: trainingParams.learningRate,
        epochs: trainingParams.epochs,
        trainingInstance: trainingInstance,
      })
    );
  });
  trainingInstance.addEventListener("end", () => {
    dispatch(stoppedTraining({ network, server }));
  });
  trainingInstance.addEventListener(
    "batchProgress",
    (epoch, accuracy, err, learningRate, trainedNetwork) => {
      setNetwork(
        server,
        Object.assign(JSON.parse(trainedNetwork), {
          name: network.name,
          id: network.id,
        }),
        dispatch,
        false
      );
      dispatch(
        trainingProgress({
          epoch,
          err,
          accuracy,
          learningRate,
          server,
          network,
          epochs: trainingParams.epochs,
        })
      );
    }
  );
  trainingInstance.startLearning();
};
