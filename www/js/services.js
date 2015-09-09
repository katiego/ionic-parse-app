angular.module('ionicParseApp.services', [])

.factory('Meditations', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var meditations = [{
    id: 0,
    title: 'Surfing The Hallows',
    recording: 'https://s3-us-west-1.amazonaws.com/ionicparseapp-meditations/SurfingTheHallows.mp3',
    author: 'Author',
    description: 'testing description',
    tags: [],
    time: 27
  }, {
   id: 1,
   title: 'Points Yoga Nidra',
   recording: 'https://s3-us-west-1.amazonaws.com/ionicparseapp-meditations/PointsYoga.mp3',
   author: 'Author',
   description: 'testing description',
   tags: [],
   time: 17 
  }, {
   id: 2,
   title: 'Traditional Ten Minute Nidra',
   recording: 'https://s3-us-west-1.amazonaws.com/ionicparseapp-meditations/TenMinNidra.mp3',
   author: 'Author',
   description: 'testing description',
   tags: [],
   time: 11 
  }];

  return {
    all: function() {
      return meditations;
    },
    get: function(meditationId) {
      for (var i = 0; i < meditations.length; i++) {
        if (meditations[i].id === parseInt(meditationId)) {
          return meditations[i];
        }
      }
      return null;
    }
  };
})


.filter('rangeFilter', function() {
    return function( items, rangeInfo ) {
        var filtered = [];
        var min = parseInt(rangeInfo.userMin);
        var max = parseInt(rangeInfo.userMax);
        // If time is with the range
        angular.forEach(items, function(item) {
            if( item.time >= min && item.time <= max ) {
                filtered.push(item);
            }
        });
        return filtered;
    };
});
