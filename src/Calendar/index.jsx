import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  getMonth,
  getWeek,
  getYear,
  parse,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns';
import { tr } from 'date-fns/locale';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import styled from 'styled-components';

import './main.scss';

const StyledDate = styled.div`
  background-color: ${({ color }) => color || 'transparent'};
  color: ${({ color }) => (color ? '#fff' : '#000')};
  border-radius: 5px;
  padding-left: 5px;
  padding-right: 5px;
  position: absolute;
  width: 100%;
  height: 24px;
  font-size: 12px;
  z-index: 9;
  left: 0;
  top: 0;
  cursor: pointer;

  &:hover {
    // background opacity 0.5
    background-color: ${({ color }) => (color ? color + '80' : 'transparent')};
    color: #fff;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
  }
`;

const StyledCalendar = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 10px;
  background-color: #fff;

  & .date-container {


    padding: 5px;
    border-radius: 5px;
    margin-bottom: 5px;


  }

`;

const EventList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const EventItem = styled.li`
  margin-bottom: 5px;
`;

const Calender = ({
  events,
  onChange = ({ day, month, year, fullDate = '' }) => {},
  showDetailEvent = (event) => {},
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const currentYear = useMemo(() => getYear(currentDate), [currentDate]);

  const currentMonth_ = useMemo(() => getMonth(currentDate), [currentDate]);

  const weekStart = useMemo(
    () => startOfWeek(new Date(), { locale: tr, weekStartsOn: 1 }),
    []
  );

  const firstDayOfCurrentMonth = useMemo(
    () => startOfMonth(currentMonth),
    [currentMonth]
  );

  const lastDayOfCurrentMonth = useMemo(
    () => endOfMonth(currentMonth),
    [currentMonth]
  );

  const dayNames = useMemo(
    () =>
      new Array(7).fill(null).map((_, index) => {
        const day = addDays(weekStart, index);
        return format(day, 'eee', { locale: tr, weekStartsOn: 1 });
      }),
    [weekStart]
  );

  const lastWeekOfPrevMonth = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(subDays(firstDayOfCurrentMonth, 1), {
          weekStartsOn: 1,
        }),
        end: subDays(firstDayOfCurrentMonth, 1),
      }),
    [firstDayOfCurrentMonth]
  );

  const firstWeekOfNextMonth = useMemo(
    () =>
      eachDayOfInterval({
        start: addDays(lastDayOfCurrentMonth, 1),
        end: endOfWeek(addDays(lastDayOfCurrentMonth, 1), { weekStartsOn: 1 }),
      }),
    [lastDayOfCurrentMonth]
  );

  const daysInMonth = useMemo(
    () =>
      eachDayOfInterval({
        start: firstDayOfCurrentMonth,
        end: lastDayOfCurrentMonth,
      }),
    [firstDayOfCurrentMonth, lastDayOfCurrentMonth]
  );

  const days = useMemo(
    () => lastWeekOfPrevMonth.concat(daysInMonth, firstWeekOfNextMonth),
    [lastWeekOfPrevMonth, daysInMonth, firstWeekOfNextMonth]
  );

  const weeks = useMemo(
    () =>
      Array.from({ length: days.length / 7 }, (_, index) =>
        days.slice(index * 7, (index + 1) * 7)
      ),
    [days]
  );

  const getEventsForDate = useCallback(
    (date) => {
      return [...events].filter(
        (event) =>
          date >=
            parse(event?.started_at, 'yyyy-MM-dd', new Date(), {
              locale: tr,
              weekStartsOn: 1,
            }) &&
          date <=
            parse(event?.finished_at, 'yyyy-MM-dd', new Date(), {
              locale: tr,
              weekStartsOn: 1,
            })
      );
    },
    [events]
  );

  const handleNextMonth = useCallback(() => {
    setCurrentDate(addMonths(currentDate, 1));
    setCurrentMonth(addMonths(currentDate, 1));
  }, [currentDate]);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(subMonths(currentDate, 1));
    setCurrentMonth(subMonths(currentDate, 1));
  }, [currentDate]);

  const handleChangeMonth = useCallback((month) => {
    setCurrentDate(setMonth(currentDate, month));
    setCurrentMonth(setMonth(currentDate, month));
  }, []);

  const handleChangeYear = useCallback(
    (year) => {
      setCurrentDate(setYear(currentDate, year));
      setCurrentMonth(setYear(currentDate, year));
    },
    [currentDate]
  );

  const isDayInCurrentMonth = useCallback(
    (day) => {
      return (
        getMonth(day) === getMonth(currentMonth) &&
        getYear(day) === getYear(currentMonth)
      );
    },
    [currentMonth]
  );

  const handleEventItemClick = useCallback(
    (event) => {
      showDetailEvent(event);
    },
    [showDetailEvent]
  );

  useEffect(() => {
    onChange({
      day: getDate(currentDate),
      month: getMonth(currentDate),
      year: getYear(currentDate),
      fullDate: format(currentDate, 'dd MMMM yyyy', { locale: tr }),
    });
  }, [currentDate]);

  return (
    <Container>
      <Card className={'h-100 shadow-sm'}>
        <Card.Header>
          <Row className="mb-3 justify-content-between">
            <Col sm={2}>
              <ButtonGroup size={'sm'}>
                <Button onClick={handlePrevMonth} variant="outline-dark">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle-chevron-left"
                    size={'1x'}
                    width={24}
                  />
                </Button>
                <Button onClick={handleNextMonth} variant="outline-dark">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle-chevron-right"
                    size={'1x'}
                    width={24}
                  />
                </Button>
              </ButtonGroup>
            </Col>
            <Col sm={6} className="text-center">
              <h4>{format(currentMonth, 'MMMM yyyy', { locale: tr })}</h4>
            </Col>
            <Col sm={2} className="text-end">
              <select
                className="form-select"
                value={currentDate.getMonth()}
                onChange={(e) => handleChangeMonth(parseInt(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, index) =>
                  format(new Date(currentYear, index, 1), 'MMMM', {
                    locale: tr,
                  })
                ).map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </Col>

            <Col sm={2} className="text-end">
              <select
                className="form-select"
                value={currentDate.getFullYear()}
                onChange={(e) => handleChangeYear(parseInt(e.target.value))}
              >
                {Array.from(
                  { length: 11 },
                  (_, i) => currentDate.getFullYear() - 5 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </Col>
          </Row>
          <Row className="m-auto justify-content-center w-100">
            <div className="col-day-name">
              <span className="d-none d-md-block">Hafta</span>
            </div>
            {dayNames.map((day, index) => (
              <div key={index} className="col-day-name">
                <span>{day}</span>
              </div>
            ))}
          </Row>
        </Card.Header>
        <Card.Body>
          <Row className=" text-center w-100">
            {weeks.map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                <Col className="col-day mb-3 d-flex flex-column align-items-center justify-content-center">
                  <span className={'fs-3'}>
                    {getWeek(week[0], { weekStartsOn: 1 })}
                  </span>
                </Col>
                {week.map((day, dayIndex) => (
                  <Col
                    key={dayIndex}
                    className={cx('col-day mb-3', {
                      'opacity-down': !isDayInCurrentMonth(day),
                    })}
                  >
                    <div className="date-container h-100 d-flex flex-column">
                      <div className="card day-card h-100 shadow-sm rounded-4">
                        <div className="card-body px-2">
                          <div className="card-title">{format(day, 'd')}</div>
                          <div
                            css={`position: relative !important;
                                  min-height: 0;
                                  height: 100%`}
                          >
                            <EventList>
                              {getEventsForDate(day).map((event, i) => (
                                <EventItem
                                  key={i}
                                  onClick={() => handleEventItemClick(event)}
                                  className={cx('event-item')}
                                >
                                  <StyledDate color={event.renk_kodu}>
                                    {event.title}
                                  </StyledDate>
                                </EventItem>
                              ))}
                            </EventList>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </React.Fragment>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Calender;
