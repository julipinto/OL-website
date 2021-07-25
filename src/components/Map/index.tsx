import React, { useEffect, useState } from 'react';
import { Map } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import './styles.css';
import { Legend } from '../atomic/atoms';
import { WebOLForm } from '../atomic/templates';
import { information, loggiSymbol } from '../../assets';

const MapLeaflet: React.FC = () => {
  const [lng, setLng] = useState(-55.0967);
  const [lat, setLat] = useState(-12.4347);
  const [zoom, setZoom] = useState(5.2);
  const [map, setMap] = useState<Map>();

  useEffect(() => {
    map?.on('move', () => {
      const center = map.getCenter();
      setLat(parseFloat(center.lat.toFixed(4)));
      setLng(parseFloat(center.lng.toFixed(4)));
      setZoom(map.getZoom());
    });
  }, [map]);

  const flyToBrazil = () => {
    map?.flyTo({ lng: -55.0967, lat: -12.4347 }, 5.2);
  };

  const options = [
    { id: 'minmax', value: 'minmax', label: 'Minmax' },
    { id: 'minsum', value: 'minsum', label: 'Minsum' },
  ];

  const legendItems = [
    { icon: information, label: 'teste' },
    { icon: information, label: 'teste' },
    { icon: information, label: 'teste' },
  ];

  const [selectedAlgorithm, setSelectedAlgorithm] = useState(options[0].value);
  const [isOn, setisOn] = useState(false);

  return (
    <MapContainer
      className="map-container"
      center={[lat, lng]}
      zoom={zoom}
      whenCreated={setMap}
    >
      <div className="forward">
        {/* <QueryForm
        options={options}
        onChange={(event) => {
          setSelectedAlgorithm(event.target.value);
        }}
      /> */}
        <WebOLForm
          options={options}
          onDropDownChange={(event) => {
            console.log(event.target.value);
            setSelectedAlgorithm(event.target.value);
          }}
          toggled={isOn}
          setIsToggled={setisOn}
        />

        <Legend legendItems={legendItems} />

        <TileLayer
          // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          attribution={`&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>`}
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN}`}
        />
      </div>
    </MapContainer>
  );
};

export default MapLeaflet;
