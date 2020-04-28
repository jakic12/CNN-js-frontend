import React from "react";
import { connect } from "react-redux";
import { fetchDatasets } from "../redux/actions/datasets";
import { NetworkCardParent } from "../components/NetworkCard";
import Error, { translateError } from "../components/Error";
import ServerLogin from "../components/ServerLogin";
import DatasetCard, { AddDatasetCard } from "../components/DatasetCard";
import { PropagateLoader } from "react-spinners";

class Datasets extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.servers.servers.map((server) =>
      this.props.fetchDatasets(server)
    );
  }

  render() {
    return (
      <div>
        {this.props.servers.servers.map((server) => (
          <NetworkCardParent
            title={server.uniqueName}
            key={`dataset_parent${server.uniqueName}`}
          >
            {this.props.datasets.serverDatasetsLoading[server.uniqueName] && (
              <div style={{ width: `100%`, heigh: `100%` }}>
                <PropagateLoader />
              </div>
            )}
            {this.props.datasets.serverDatasetsError[server.uniqueName] &&
              this.props.datasets.serverDatasetsError[server.uniqueName] !==
                `Unauthorized` && (
                <Error
                  error={translateError(
                    this.props.datasets.serverDatasetsError[server.uniqueName]
                  )}
                  retryFunction={() => this.props.fetchDatasets(server)}
                />
              )}
            {this.props.datasets.serverDatasetsError[server.uniqueName] ===
              `Unauthorized` && <ServerLogin server={server} />}
            {!this.props.datasets.serverDatasetsLoading[server.uniqueName] &&
              !this.props.datasets.serverDatasetsError[server.uniqueName] &&
              this.props.datasets.datasets[server.uniqueName] && (
                <>
                  {Object.keys(
                    this.props.datasets.datasets[server.uniqueName]
                  ).map((datasetId) => (
                    <DatasetCard
                      key={`dataset_card_${datasetId}`}
                      dataset={
                        this.props.datasets.datasets[server.uniqueName][
                          datasetId
                        ]
                      }
                      serverId={server.uniqueName}
                    />
                  ))}
                  <AddDatasetCard server={server} />
                </>
              )}
          </NetworkCardParent>
        ))}
      </div>
    );
  }
}

export default connect(
  (state) => state,
  (dispatch) => ({
    fetchDatasets: (server) => fetchDatasets(server, dispatch),
  })
)(Datasets);
