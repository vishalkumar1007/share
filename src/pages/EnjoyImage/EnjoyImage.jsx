import './EnjoyImage.css'

const EnjoyImage = ({ImageTabOpenAction}) => {
    const handelCloseTab = ()=>{
        ImageTabOpenAction(false);
    }  
  return (
    <div className='EnjoyImage_main'>
        <div className="EnjoyImage_main_top">
            <button className="EnjoyImage_main_top_close_tab" onClick={()=>handelCloseTab()}>
                <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="24px" fill="#5c5c5c"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </button>
        </div>
        <div className="EnjoyImage_main_top_bottom" >
            
        </div>
    </div>
  )
}

export default EnjoyImage
