import React, { useEffect, useState } from 'react';
import { Map } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import './styles.css';
import { Legend, LoadingScreen, SquaredButton } from '@atoms';
import { WebOLForm, WebSelectArea } from '@templates';
import { fullScreenBR, HomePageMode, mapLegend } from '../../utils';
import { useCandidates, useExecutionQuery, useSelectId } from '@hooks';
import { home } from '@assets';
import DisablePropagation from './DisablaPropagation';
import { MRegions, MCandidates, MDeliveries, MHubs } from '@marker-clusters';

const MapLeaflet: React.FC = () => {
  const [map, setMap] = useState<Map>();
  const [mode, setMode] = useState<HomePageMode>(HomePageMode.AREA_SELECTOR);
  const [legendItems, setLegendItems] = useState(mapLegend.AREA_SELECTOR);
  const [isOn, setisOn] = useState(false);
  const { selectedArea, onSelectId } = useSelectId();
  const { onResetCandidates } = useCandidates();

  useEffect(() => {
    if (selectedArea) {
      map?.flyTo({ lat: selectedArea?.lat, lng: selectedArea?.lng }, 11);
      setMode(HomePageMode.QUERY_FORM);
    }
    //eslint-disable-next-line
  }, [selectedArea]);

  useEffect(() => {
    setLegendItems(mapLegend[mode]);
    if (mode === HomePageMode.AREA_SELECTOR) {
      setisOn(false);
      onResetCandidates();
    }
  }, [mode, onResetCandidates]);

  const flyToFullScreenBR = () => {
    map?.flyTo(fullScreenBR.latlng, fullScreenBR.zoom);
  };

  const { isEmpty: executionIsEmpty } = useExecutionQuery();

  return (
    <MapContainer
      className="map-container"
      center={[fullScreenBR.latlng.lat, fullScreenBR.latlng.lng]}
      zoom={fullScreenBR.zoom}
      whenCreated={setMap}
      preferCanvas={true}
    >
      {!executionIsEmpty ? (
        <div className="loadingscreen-container">
          <LoadingScreen />
        </div>
      ) : undefined}

      <DisablePropagation>
        <MCandidates editCandidates={isOn} mode={mode} />

        {mode === HomePageMode.QUERY_FORM ? (
          <div>
            <MHubs />
            <MDeliveries />
            <SquaredButton
              squaredIcon={home}
              onClick={() => {
                flyToFullScreenBR();
                setMode(HomePageMode.AREA_SELECTOR);
                onSelectId(undefined);
              }}
              styles={{ margin: '12px', position: 'absolute' }}
            />
            <WebOLForm toggled={isOn} setIsToggled={setisOn} />
          </div>
        ) : (
          <div className="areaSelector">
            <WebSelectArea />
            <MRegions />
          </div>
        )}

        <Legend legendItems={legendItems} />
      </DisablePropagation>
      <TileLayer
        attribution={`&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>`}
        url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN}`}
      />
    </MapContainer>
  );
};

export default MapLeaflet;
