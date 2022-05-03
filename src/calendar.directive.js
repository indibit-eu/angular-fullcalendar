angular
    .module('calendar', [])
    .directive('calendar', [
        function () {
            return {
                restrict: 'E',
                replace: 'element',
                scope: {
                    height: '<',
                    eventSources: '<',
                    eventClick: '&',
                    slotClick: '&',
                },
                link: function (scope, element) {
                    var _element = $(element)
                    var options = {
                        themeSystem: 'bootstrap3',
                        locale: 'de',
                        timezone: 'local',      // if you store timezone information for your events and you want events displayed differently depending on the local timezone of each end-user’s computer.
                        defaultView: 'agendaWeek',
                        weekends: false,
                        columnHeaderFormat: 'ddd D.',
                        height: scope.height,
                        slotLabelFormat: 'HH:mm',
                        timeFormat: 'HH:mm',
                        selectable: scope.slotClick !== undefined,           // whether days / slots can be clicked
                        nowIndicator: true,
                        eventSources: scope.eventSources,
                        buttonText: {
                            today: 'Heute'
                        },
                        allDayText: '',
                        allDaySlot: false,
                        eventClick: function(calEvent) {
                            // an event has been clicked
                            scope.eventClick({
                                event: calEvent,
                                onEventChanged: function (changedCalEvent) {
                                    _element.fullCalendar('updateEvent', changedCalEvent)
                                }
                            })
                        },
                        dayClick: function (date) {
                            // a day / slot has been clicked
                            scope.slotClick({
                                date: date.toDate(),
                                onEventCreated: function () {
                                    // changed have been made
                                    _element.fullCalendar('refetchEventSources', ['events'])
                                }
                            })
                        }
                    };
                    _element.fullCalendar(options)
                }
            }
        }
    ]);