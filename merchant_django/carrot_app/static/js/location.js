let regionSaveButton = document.getElementById("region-save-button");

//지도 현재위치로 보여주기
let mapContainer = document.getElementById("map"),
  mapOption = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    level: 6, // 지도의 확대 레벨
  };

let map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성


// HTML5의 geolocation으로 사용할 수 있는지 확인
if (navigator.geolocation) {
  // GeoLocation을 이용해서 접속 위치를 얻어옵니다
  navigator.geolocation.getCurrentPosition(function (position) {
    let lat = position.coords.latitude; // 위도
    let lon = position.coords.longitude; // 경도

    let locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
      message = '<div style="padding:5px;">현재 위치<div>'; // 인포윈도우에 표시될 내용입니다

    // 마커와 인포윈도우를 표시합니다
    displayMarker(locPosition, message);
    let geocoder = new kakao.maps.services.Geocoder();

    function GetAddr(lat, lon) {
      let geocoder = new kakao.maps.services.Geocoder();

      let coord = new kakao.maps.LatLng(lat, lon);
      let callback = function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          console.log(result);
          let currentLocation = result[0].address.address_name;

          document.getElementById("region-info").innerText =
            "현재위치는 " + result[0].address.address_name + "입니다.";

          let regionSettingValue = document.querySelector(
            'input[name="region-setting"]'
          ).value;
          let regionArray = regionSettingValue.split(" ");
          let lastRegionPart = regionArray[regionArray.length - 1];

          let currentLocationArray = currentLocation.split(" ");
          let regionJudgeText = document.getElementById("region-judge");

          if (currentLocationArray.includes(lastRegionPart)) {
            regionJudgeText.innerText = "현재 위치가 내 동네 설정과 같습니다.";
          } else {
            regionJudgeText.innerText = "현재 위치가 내 동네 설정과 다릅니다.";
            regionSaveButton.classList.toggle("button-disabled");
          }
        }
      };
      geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    }
    GetAddr(lat, lon);
  });
} else {
  // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

  let locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
    message = "사용자 환경문제로 위치정보를 사용할 수 없습니다";

  displayMarker(locPosition, message);
}

// 지도에 마커와 인포윈도우를 표시하는 함수
function displayMarker(locPosition, message) {
  // 마커 생성

  // 마커 이미지를 생성합니다
  let imageSrc = "/static/img/Location.png"; // 마커이미지의 주소입니다
  
  imageSize = new kakao.maps.Size(65, 65), // 마커이미지의 크기입니다
  imageOption = {offset : new kakao.maps.Point(27, 69)}; 
  // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
  let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

  // 마커를 생성합니다
  let marker = new kakao.maps.Marker({ 
    map: map, 
    position: locPosition,
    image: markerImage // 마커이미지 설정  
  });

  let iwContent = message, // 인포윈도우에 표시할 내용
    iwRemoveable = true;

  // 인포윈도우를 생성
  let infowindow = new kakao.maps.InfoWindow({
    content: iwContent,
    removable: iwRemoveable,
  });

  // 인포윈도우를 마커위에 표시
  /* infowindow.open(map, marker); */

  // 지도 중심좌표를 접속위치로 변경
  map.setCenter(locPosition);
  

  var circle = new kakao.maps.Circle({
      map: map,
      center : locPosition,
      radius: 1000,   // 원의 크기조절
      strokeWeight: 0.5, //테두리 선 굵기
      strokeColor: '#0066FF', // 테두리 선 색
      strokeOpacity: 1,
      strokeStyle: 'solid', //실선은 dashed
      fillColor: '#00EEEE', 
      fillOpacity: 0.2, //채우기 불투명도 
  });

  // 지도에 원을 표시합니다 
  circle.setMap(map); 


}

document.getElementById("region-form").addEventListener("submit", function (e) {
  e.preventDefault();

  let region = document.querySelector('input[name="region-setting"]').value;

  if (region.trim()) {
    this.submit();
  } else {
    alert("지역을 입력해주세요");
  }
});
regionSaveButton.addEventListener("click", function () {
  alert("인증이 완료되었습니다");
});
