import React, { useEffect, useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./index.css";
import { Link } from "react-router-dom";
import Readme from "../Readme/Readme";
import { getAllLectures } from "../../redux/actions/lecturesActions";
import {useSelector, useDispatch} from "react-redux";
import Header from "../Header/index.js"

const OneLecture = (props) => {
  const dispatch = useDispatch()
  const history = useHistory();
  const allLectures = useSelector (state => state.lectures.lectures)
  const [indexOfThisLecture, setIndexOfThisLecture] = useState(null)

  const [allVideos, setAllVideos] = useState([{
    _id: "",
    img: "",
    lecture: "",
    profesor: "",
    title: "",
    url: ""
  }]);

  const [lecture, setLecture] = useState({
    title: "",
    desription: "",
    urlLecture: "",
    modulo: ""
  });

  useEffect(() => {
    dispatch(getAllLectures())
    getVideos();
    getOneLecture();
  }, []);

  const getVideos = () => {
    axios.get("http://localhost:5000/videos/", { params: { lectureid: props.match.params.lectureid } })
      .then(res => {
        setAllVideos(res.data);
      });
  };

  const getOneLecture = () => {
    axios.get(`http://localhost:5000/lectures/${props.match.params.lectureid}`).then(
      res => {
        setLecture(res.data);
      }
    );
  };


  /*var urlVideo = allVideos[0].url
  urlVideo = urlVideo.replace("https://vimeo.com/", "")
  var urlVimeo = "https://player.vimeo.com/video/307791576?title=0&byline=0&portrait=0"
  urlVimeo = urlVimeo.replace("307791576", urlVideo)*/

  console.log(allLectures)
  const getIndexOfThisLecture = allLectures.findIndex(l => l._id === lecture._id)
  console.log(getIndexOfThisLecture)
  var lectureAnterior = getIndexOfThisLecture === 0 ? 0 : getIndexOfThisLecture -1
  var lectureSiguiente = getIndexOfThisLecture +1

  var prevLecture = allLectures[lectureAnterior] === undefined ? null : allLectures[lectureAnterior]._id

  var nextLecture = function () {
    if (allLectures[lectureSiguiente] === undefined && allLectures[getIndexOfThisLecture] === undefined) {
      return null
    }
    if (allLectures[lectureSiguiente] === undefined && allLectures[getIndexOfThisLecture]) {
      return allLectures[getIndexOfThisLecture]._id
    }
    return allLectures[lectureSiguiente]._id
  }


  return (
    <div>  
      <Header/>
      <div className = "link">   
      <Link to={{ pathname: lecture.urlLecture }} target="_blank">
        <h1 className = "h1"><i className="fab fa-github"></i>{lecture.title}</h1>
      </Link>
      </div> 
      <br />

      <div className = "menuDiv">
      {allLectures.length === 0 ? null :
      <Fragment>
      <div className = "changeLecture" onClick = {()=> {history.push(`/lecture/${prevLecture}`); location.reload()} }><i class="fa fa-arrow-left fa-2x" aria-hidden="true"></i></div>
      <div className = "returns" className = "changeLecture" onClick = {()=> {window.history.back()}}>VOLVER</div>
      <div className = "changeLecture" onClick = {()=> {history.push(`/lecture/${nextLecture()}`); location.reload()} }><i class="fa fa-arrow-right fa-2x" aria-hidden="true"></i></div>
      </Fragment>}
     </div>

      <br/>
      <div>
        

      </div>
      
      {/* <div className="videoCard-grid">
        {allVideos.map((video, index) => {
          return (
            <div key={index}>
              <CardVideo video={video} />
            </div>
          );
        })}
      </div>*/}

      <div className = "video" >
        <iframe src= "https://player.vimeo.com/video/426051769" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
      </div>
      <Readme title = {lecture.title} url = {lecture.urlLecture}/>
    </div >
  );
};


export default OneLecture;
