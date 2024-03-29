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
                    eventRender: '&',
                    slotClick: '&',
                    createClick: '&',
                    defaultView: '<',
                    listWeekEnabled: '<'
                },
                link: function (scope, element) {
                    var _element = $(element)
                    var options = {
                        themeSystem: 'bootstrap3',
                        locale: 'de',
                        timezone: 'local',      // if you store timezone information for your events and you want events displayed differently depending on the local timezone of each end-user’s computer.
                        customButtons: scope.createClick
                            ? {
                                createButton: {
                                    text: 'Neuer Termin',
                                    click: scope.createClick
                                }
                            }
                            : {},
                        header: {
                            left: 'today prev,next title',
                            center: '',
                            right: scope.createClick
                                ? (scope.listWeekEnabled ? 'listWeek month,agendaWeek,agendaDay createButton' : 'month,agendaWeek,agendaDay createButton')
                                : (scope.listWeekEnabled ? 'listWeek month,agendaWeek,agendaDay' : 'month,agendaWeek,agendaDay')
                        },
                        // views: {
                        //     agendaFiveDay: {
                        //         type: 'agenda',              das scheint in v3 nicht zu gehen
                        //         hiddenDays: [0, 6],
                        //         buttonText: '5 Tage'
                        //     }
                        // },
                        defaultView: scope.defaultView === undefined ? 'agendaWeek' : scope.defaultView,
                        // weekends: false,
                        columnHeaderFormat: 'ddd D.',
                        height: scope.height,
                        slotLabelFormat: 'HH:mm',
                        timeFormat: 'HH:mm',
                        selectable: scope.slotClick !== undefined,           // whether days / slots can be clicked
                        nowIndicator: true,
                        scrollTime: '07:00:00',     // initial auf 7 Uhr scrollen
                        scrollTimeReset: false,     // aktuellen Zeitausschnitt nicht zurücksetzen, wenn der Datumsbereich geändert wird
                        eventSources: scope.eventSources,
                        buttonText: {
                            today: 'Heute',
                            listWeek: 'Wochenliste',
                            agendaWeek: 'Woche'
                        },
                        allDayText: '',
                        allDaySlot: false,
                        // function parameters must be passed as 'maps'
                        // see https://docs.angularjs.org/guide/directive#creating-a-directive-that-wraps-other-elements
                        eventClick: function(calEvent) {
                            // an event has been clicked
                            if (scope.eventClick) {
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
                            }
                        },
                        // event ist being rendered (hook for modifying its DOM)
                        eventRender: function(event, element) {
                            if (scope.eventRender) {
                                scope.eventRender({
                                    event: event,      // the Event Object being rendered
                                    element: element   // jQuery element that will be used for rendering (already populated with time/title text)
                                })
                            }
                        },
                        dayClick: function (date) {
                            // a day / slot has been clicked
                            if (scope.slotClick) {
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
                        }
                    };

                    // initialisieren
                    _element.fullCalendar(options)

                    // auf Ereignisse reagieren
                    scope.$on('refetch-event-sources', function (e, eventSources) {
                        _element.fullCalendar('refetchEventSources', eventSources)
                    })

                    scope.$on('change-view', function (e, view) {
                        _element.fullCalendar('changeView', view)
                    })

                }
            }
        }
    ]);