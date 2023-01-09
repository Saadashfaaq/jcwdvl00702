import Axios from "axios"
import "../assets/styles/addressShipping.css"
import {useState,useEffect} from "react"
import {ArrowBack,LocalShipping} from "@mui/icons-material"
import {Link,useHistory,useLocation} from "react-router-dom"
import {Container} from "@mui/material"
import { useSelector } from "react-redux"

export default function ChooseShipping(){
    const history = useHistory()
    const location = useLocation()

    const { user } = useSelector((state) => ({
        user: state.auth.user,
    }));

    const [allWH,setAllWH]=useState("")
    const [homeLat,setHomeLat]=useState()
    const [homeLon,setHomeLon]=useState()
    const [homeId,setHomeId]=useState()
    const [ongkir,setOngkir]=useState()
    const [courier,setCourier]=useState("")
    const [costSelect,setCostSelect]=useState()
    const [orderState, setOrderState] = useState([])

    const getDistance=(lat1,lon1,lat2,lon2)=>{
        let R = 6371 //in km
        let dLat = toRad(lat2-lat1);
        let dLon = toRad(lon2-lon1);
        lat1 = toRad(lat1);
        lat2 = toRad(lat2);

        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        let d = R * c;
        return d;
    }
    const toRad=(val)=>{
        return val * Math.PI / 180
    }

    const fetchLocations=()=>{
        Axios.get(`http://localhost:3300/api/warehouse/warehouse-list`)
        .then(res=>{
            setAllWH(res.data)
            setHomeId(location.state)
        })
    }

    const compareDist=(a,b)=>{
        if(a.totalDistance < b.totalDistance){
            return -1
        }
        if(a.totalDistance > b.totalDistance){
            return 1
        }
        return 0
    }

    const homeCoordinate=()=>{
        Axios.get(`http://localhost:3300/api/address/address-city-id/${homeId}`)
        .then(res=>{
            setHomeLat(res.data.latitude)
            setHomeLon(res.data.longitude)
        })
    }

    const distanceCheck=()=>{
        let mathDist=[]
        for (let x=0; x<allWH.length; x++){
                mathDist.push(getDistance(parseInt(homeLat),parseInt(homeLon),parseInt(allWH[x].latitude),parseInt(allWH[x].longitude)))
                allWH[x].totalDistance=mathDist[x]
        }
        allWH.sort(compareDist) //now allWh are sorted from nearest to furthest
    }

    const ongkirCount=()=>{
        distanceCheck()
        let courierCode = ""
        if(courier.length>2){
            courierCode = courier.split(" ")
            courierCode = courierCode[0].toLowerCase()
        } else {
            courierCode = courier.toLowerCase()
        }
        
        const req = {
            origin: allWH[0].city_id,
            destination: homeId,
            courier: courierCode,
        }
        Axios.post(`http://localhost:3300/api/address/ongkir-type`,req)
        .then(res=>{
            const rajaongkirData = JSON.parse(res.data)
            const rajaongkirCost = rajaongkirData.rajaongkir.results[0]
            setOngkir(rajaongkirCost)
            console.log(rajaongkirCost)
        })
    }

  // mengambil data order
  const getOrder = () => {
    Axios.get(`http://localhost:3300/api/order/get-order/${user?.customer_uid}`)
    .then((result) => {
      setOrderState(result.data);
      console.log("ini get order", result.data)
    })
    .catch(() => {
      alert('Terjadi kesalahan di server');
    });
  }

    useEffect(()=>{
        getOrder()
        fetchLocations()
    },[])

    const courierSelect=(
        <div className="ship-courier-selector">
            <select className="courier-option" onChange={e=>setCourier(e.target.value)} onClick={homeCoordinate}>
                <option>JNE</option>
                <option>POS Indonesia</option>
                <option>TIKI</option>
            </select>
            <button className="courier-acc" onClick={ongkirCount}>Select Courier</button>
        </div>
    )

    const deliveryCard=(x)=>{
        return (
            <div className="ship-choice">
                <div className="ship-method">
                    <LocalShipping style={{fill: "black"}}/>
                    <div className="ship-choice-text">
                        <div className="ship-choice-title">{x.description}</div>
                        <div className="ship-choice-spec">Estimated Arrival {x.cost[0].etd}</div>
                    </div>
                </div>
                <div className="ship-select-dot">
                    <div className="ship-fee">Rp.{x.cost[0].value}</div>
                    <div className="ship-selector"><input type="radio" value={x.cost[0].value} className="ship-radio" name="shipradio" onChange={e=>setCostSelect(parseInt(e.target.value))}/></div>
                </div>
            </div>
        )
    }

    const ongkirFinal=()=>{
        const data = {
            shipping_courier: courier,
            shipping_price: costSelect,
          }
          Axios.put(`http://localhost:3300/api/order/edit-shipping/${user.customer_uid}`, data)
          .then(() => {
            history.push(`/checkout/${user.customer_uid}/${orderState.id}`)
          })
          .catch((error) => {
            console.log(error);
            alert(error);
          });
    }

    const detectCityId=()=>{
        if(!homeId){
            history.push('/')
        }
    }
    
    return(
        <div className="ship-wrapper">
            <Container className="ship-container" maxWidth="xs">
                {/* {detectCityId()} */}
                <div className="ship-topside">
                    <div className="ship-arrowwrap">
                        <Link to ={`/address-list/${user?.customer_uid}`}>
                            <button className="ship-arrowback">
                                <ArrowBack/>
                            </button>
                        </Link>
                    </div>
                    <div className="ship-title">Choose Shipping</div>
                </div>
                <div className="ship-subwrap">
                    <div className="ship-select">
                        {courierSelect}
                        {ongkir?.costs.map(aa=>deliveryCard(aa))}
                    </div>
                    <div className="ship-continue">
                        <button 
                            className="ship-button"
                            onClick={ongkirFinal}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </Container>
        </div>
    )
}
