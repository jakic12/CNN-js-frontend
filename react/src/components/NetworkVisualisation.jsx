import React, {Component} from 'react';
import '../styles/Nv.scss'


const LayerType = {
    CONV: 0,
    POOL: 1,
    FC:2,
    INPUT:3,
    FLATTEN:4
  }

class NetworkVisualisation extends Component {
    constructor(props){
      super(props)

      this.state = {
        selectedElement:undefined,
        scale:1
      }

      this.scaleSlider = React.createRef();
      this.handleScaleChange = this.handleScaleChange.bind(this)
    }

    updateFilters(){
      this.props.networkData.shape.forEach((el, lI) => {
        if(el.type == LayerType.INPUT){
          this.props.networkData.layers[lI].forEach((layer,dI) => {
            let canv = document.getElementById(`input${lI}_${dI}`)
            let ctx = canv.getContext(`2d`)
            const imagedata = ctx.createImageData(el.w, el.h);
            
            layer.forEach((x,x1)=>{
              x.forEach((layerPixel,y1) => {
                const color = layerPixel*200
                const pixelindex = (y1 * el.w + x1) * 4

                imagedata.data[pixelindex] = color
                imagedata.data[pixelindex+1] = color
                imagedata.data[pixelindex+2] = color
                imagedata.data[pixelindex+3] = 1;

              })
            })
            
            ctx.putImageData(imagedata, 0, 0)
          })
        }else if(el.type == LayerType.CONV){
          for(let dI = 0; dI < this.props.networkData.shape[lI].d; dI++){
            let canv = document.getElementById(`filter${lI}_${dI}`)
            let ctx = canv.getContext(`2d`)
            const imagedata = ctx.createImageData(el.f, el.f);

            this.props.networkData.weights[lI][dI][0].forEach((x,y1) => {
              x.forEach((layerPixel, x1) => {
                const color = Math.abs(layerPixel*600000)
                const pixelindex = (y1 * el.f + x1) * 4

                imagedata.data[pixelindex] = color
                imagedata.data[pixelindex+1] = color
                imagedata.data[pixelindex+2] = color
                imagedata.data[pixelindex+3] = 255;

              })
            })
            ctx.imageSmoothingEnabled= false
            ctx.putImageData(imagedata, 0, 0)
          }
        }
      })
    }

    updateLayers(){

    }

    componentDidMount(){
      this.updateFilters()
    }

    handleScaleChange(event){
      this.setState({scale:event.target.value})
    }

    render(){
        return (
          <div>
            <div className="visualization" style={{height:`30vh`}}>
                {
                  !this.state.selectedElement && this.props.networkData.shape.map((el, lI) => {
                    return <div key={lI} style={{display:`inline-block`,position:`relative`, padding:`10px`, verticalAlign:`middle`, maxHeight:`100%`, overflowY:`auto`}}>
                        {(() => {
                          if(el.type == LayerType.INPUT){
                            return Array(el.d).fill(0).map((_,dI) => // depth index
                              <div key={`${lI}_${dI}_cont`}>
                                <canvas id={`input${lI}_${dI}`} height={el.h} width={el.w} key={`${lI}_${dI}`} style={{margin:`2px`, border:`1px blue solid`, height:el.h*this.state.scale, width:el.w*this.state.scale}}></canvas>
                              </div>
                            )
                          }else if(el.type == LayerType.CONV || el.type == LayerType.POOl){
										    		return Array(el.d).fill(0).map((_,dI) => // depth index
                              <div key={`${lI}_${dI}_cont`}>
                                <canvas key={`${lI}_${dI}_canv`} height={el.f} width={el.f} id={`filter${lI}_${dI}`} style={{margin:`2px`, display:`inline-block`, verticalAlign:`middle`, border:`1px green solid`,height:el.f*this.state.scale, width:el.f*this.state.scale}}></canvas>
                                <canvas key={`${lI}_${dI}_layer`} height={el.h} width={el.w} id={`cnn${lI}_${dI}`} style={{margin:`2px`, display:`inline-block`, verticalAlign:`middle`,border:`1px purple solid`,height:el.h*this.state.scale, width:el.w*this.state.scale}}></canvas>
                            	</div>
                            )
                          } else if(el.type == LayerType.FC || el.type == LayerType.FLATTEN){
                            return <div key={`${lI}_fc`} style={{width:`${10*this.state.scale}px`, height:el.l*this.state.scale, margin:`2px`, border:`1px orange solid`}}></div>
                          }
                        })()}
                    </div>
                  })
                }
                {
                  this.state.selectedElement && <div style={{display:`flex`, height:`100%`}}>
                    <div style={{width:`50%`}}>
                      <canvas id={`filter${this.state.selectedElement.lI}_${this.state.selectedElement.dI}`} height={this.props.networkData.shape[this.state.selectedElement.lI][this.state.selectedElement.dI].f} width={this.props.networkData.shape[this.state.selectedElement.lI][this.state.selectedElement.dI].f} style={{background:`white`}}></canvas>
                    </div>
                    <div style={{width:`50%`}}>
                      <canvas id={`cnn${this.state.selectedElement.lI}_${this.state.selectedElement.dI}`} style={{border:`1px green solid`}}></canvas>
                    </div>
                  </div>
                }
            </div>
            <input ref={this.scaleSlider} type="range" min={1} max={10} id={`scale`} value={this.state.scale} onChange={this.handleScaleChange}/>
          </div>
        );
    }
}
export default NetworkVisualisation;