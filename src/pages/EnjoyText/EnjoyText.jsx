import './EnjoyText.css'

const EnjoyText = ({TextTabOpenAction}) => {
  const handelCloseTab = ()=>{
    TextTabOpenAction(false);
  }  

  return (
    <div className='EnjoyText_main'>
        <div className="EnjoyText_main_top">
            <button className="EnjoyText_main_top_close_tab" onClick={()=>handelCloseTab()}>
                <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="24px" fill="#5c5c5c"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </button>
        </div>
        <div className="EnjoyText_main_top_bottom" >
            
        </div>
    </div>
  )
}

export default EnjoyText
