import * as Location from 'expo-location';

const tenMetersWithDegrees = 0.0001;

const getLocation = increment => {
    return {
        timestamp: 10000000,
        coords: {
            speed: 0,
            heading: 0,
            accuracy: 5,
            altitudeAccuracy: 5,
            altitude: 5,
            longitude: -122.0312186 + increment * tenMetersWithDegrees,
            lattitude: 37.33233141 + increment * tenMetersWithDegrees
        }
    };
};

let counter = 0;

setInterval(() => {
    Location.EventEmitter.emit('expo.LocationChanged', {
        watchId: Location._getCurrentWatchId(),
        location: getLocation(counter)
    });
    // console.log(counter);
    counter++;
}, 1000);
