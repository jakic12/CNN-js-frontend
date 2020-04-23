import {
  openDatasetFromBuffer,
  vectorizeDatasetLabels,
  normalizeInputData,
} from "../CNN-js/datasetProcessor";

class WithEventListener {
  constructor() {
    this.eventsListeners = {};
  }

  addEventListener(event, fn) {
    if (!this.eventsListeners[event]) {
      this.eventsListeners[event] = [];
    }

    this.eventsListeners[event].push(fn);
  }

  emitEvent(event, ...props) {
    console.log(event);
    if (event in this.eventsListeners)
      this.eventsListeners[event].forEach((fn) => fn(...props));
  }

  removeEventListener(event, fn) {
    this.eventsListeners[event] = this.eventsListeners[event].filter(
      (f) => fn !== f
    );
  }
}

/**
 * events:
 *  start,
 *  batchProgress
 */
export default class TrainingController extends WithEventListener {
  constructor({ server, network, dataset, trainingParams }) {
    super();
    this.server = server;
    this.network = network;
    let datasetToBeTrained = dataset.data;
    datasetToBeTrained = openDatasetFromBuffer(
      datasetToBeTrained,
      datasetToBeTrained.colorDepth,
      datasetToBeTrained.imageSize
    );
    if (dataset.vectorize) {
      datasetToBeTrained = vectorizeDatasetLabels(
        datasetToBeTrained,
        network.shape[network.shape.length - 1].l
      );
    }
    if (dataset.normalizeMax) {
      datasetToBeTrained = normalizeInputData(
        datasetToBeTrained,
        dataset.normalizeMax
      );
    }
    this.dataset = datasetToBeTrained;
    this.trainingParams = trainingParams;
  }

  startLearning() {
    if (this.server.url === "local") {
      this.emitEvent("start");
      try {
        new Promise((resolve) => {
          this.network.sgd(
            Object.assign({}, this.trainingParams, {
              onProgress: (epoch, accuracy, err, learningRate) => {
                this.emitEvent(
                  "batchProgress",
                  epoch,
                  accuracy,
                  err,
                  learningRate
                );
              },
              onEnd: () => {
                this.emitEvent("end");
              },
              dataset: this.dataset,
            })
          );
          resolve();
        }).then(() => {});
      } catch (error) {
        console.error(error);
        debugger;
      }
    } else {
      console.error("network training not supported yet");
      //TODO: learning over the network
    }
  }
}
