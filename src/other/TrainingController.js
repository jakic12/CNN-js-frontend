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
      this.trainingInstance = new Worker("/trainingWorker.js");
      this.trainingInstance.addEventListener("message", (m) => {
        this.emitEvent(m.data.event, ...m.data.data);
      });
      this.trainingInstance.postMessage({
        network: JSON.stringify(this.network),
        trainingProps: Object.assign({}, this.trainingParams, {
          dataset: this.dataset,
        }),
      });
    } else {
      console.error("network training not supported yet");
      //TODO: learning over the network
    }
  }

  terminate() {
    if (this.trainingInstance) this.trainingInstance.terminate();
  }
}
