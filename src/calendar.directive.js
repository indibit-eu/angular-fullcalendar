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
                        // function parameters must be passed as 'maps'
                        // see https://docs.angularjs.org/guide/directive#creating-a-directive-that-wraps-other-elements
                        eventClick: function(calEvent) {
                            // an event has been clicked
                            scope.eventClick({
                                event: calEvent,
                                /**
                                 * Update event data
                                 * @param calEvent
                                 */
                                updateEvent: function (calEvent) {
                                    _element.fullCalendar('updateEvent', calEvent)
                                },
                                /**
                                 * Refetch the events from the source
                                 */
                                refetchSource: function (sourceId) {
                                    // https://fullcalendar.io/docs/v3/refetchEventSources
                                    _element.fullCalendar('refetchEventSources', [sourceId])
                                }
                            })
                        },
                        // render title for background events, too
                        eventRender: function(event, element){
                            if (event.rendering === 'background' && event.title){
                                element.append(event.title);
                            }
                        },
                        dayClick: function (date) {
                            // a day / slot has been clicked
                            scope.slotClick({
                                date: date.toDate(),
                                /**
                                 * Refetch the events from the source
                                 * @param sourceId
                                 */
                                refetchSource: function (sourceId) {
                                    // https://fullcalendar.io/docs/v3/refetchEventSources
                                    _element.fullCalendar('refetchEventSources', [sourceId])
                                }
                            })
                        }
                    };
                    // initialisieren
                    _element.fullCalendar(options)
                }
            }
        }
    ]);