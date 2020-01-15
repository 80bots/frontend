import React, { useRef, useState, useEffect } from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import ScheduleEditor from "../default/ScheduleEditor";
import AsyncSelect from "react-select/async";
import Icon from "../default/icons";
import Modal from "../default/Modal";
import { css } from "@emotion/core";
import { withTheme } from "emotion-theming";
import { connect } from "react-redux";
import { addNotification } from "/store/notification/actions";
import { NOTIFICATION_TYPES } from "/config";
import { Badge, Button, Paginator } from "../default";
import {
  getSchedules,
  updateSchedule,
  deleteSchedule,
  createSchedule
} from "/store/schedule/actions";
import { getRunningBots } from "/store/bot/actions";
import { Card, CardBody } from "../default/Card";
import {
  Filters,
  LimitFilter,
  SearchFilter,
  Table,
  Th,
  Thead
} from "/components/default/Table";

const Container = styled(Card)`
  background: #333;
  border: none;
  color: #fff;
`;

const IconButton = styled(Button)`
  display: inline-flex;
  justify-content: center;
  padding: 2px;
  margin-right: 5px;
  width: 30px;
  height: 30px;
  &:last-child {
    margin-right: 0;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StatusButton = styled(Button)`
  text-transform: uppercase;
`;

const Tag = styled(Badge)`
  text-transform: capitalize;
  margin-right: 0.5rem;
  font-size: 14px;
  &:last-child {
    margin-right: 0;
  }
`;

const AddButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
`;

const SelectWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 5px;
`;

const Ul = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const modalStyles = css`
  min-width: 500px;
  overflow-y: visible;
`;

const BotsSchedule = ({
  theme,
  notify,
  getSchedules,
  getRunningBots,
  createSchedule,
  deleteSchedule,
  schedules,
  total,
  runningBots,
  ...props
}) => {
  const [clickedSchedule, setClickedSchedule] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState({ value: "", field: "" });
  const [instanceId, setInstanceId] = useState(null);
  const [search, setSearch] = useState(null);

  const modal = useRef(null);
  const addModal = useRef(null);
  const editModal = useRef(null);

  useEffect(() => {
    getSchedules({ page, limit });
  }, []);

  const searchBots = (value, callback) => {
    getRunningBots({ page: 1, limit: 50, search: value }).then(action =>
      callback(action.data.data.map(toOptions))
    );
  };

  const onBotChange = option => {
    setInstanceId(option.value);
  };

  const toOptions = bot => ({
    value: bot.instance_id,
    label: bot.instance_id + "|" + bot.name
  });

  const changeScheduleStatus = schedule => {
    const statusName =
      schedule.status === "active" ? "deactivated" : "activated";
    const status = schedule.status === "active" ? "inactive" : "active";
    props
      .updateSchedule(schedule.id, { status })
      .then(() =>
        notify({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Schedule was successfully ${statusName}!`
        })
      )
      .catch(() =>
        notify({
          type: NOTIFICATION_TYPES.ERROR,
          message: "Status update failed"
        })
      );
  };

  const toggleModal = schedule => {
    setClickedSchedule(schedule);
    modal.current.open();
  };

  const toggleAddModal = () => {
    getRunningBots({ page: 1, limit: 50 });
    addModal.current.open();
  };

  const toggleEditModal = schedule => {
    setClickedSchedule(schedule);
    editModal.current.open();
  };

  const addSchedule = () => {
    if (instanceId) {
      createSchedule({ instanceId }).then(() => {
        getSchedules({
          page: 1,
          limit,
          sort: order.field,
          order: order.value,
          search
        });
        addModal.current.close();
        notify({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: "Schedule was successfully added"
        });
      });
    }
  };

  const updateSchedule = editedSchedules => {
    editModal.current.close();
    props
      .updateSchedule(clickedSchedule.id, { details: editedSchedules })
      .then(() =>
        notify({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: "Schedule was successfully updated"
        })
      )
      .catch(() =>
        notify({
          type: NOTIFICATION_TYPES.ERROR,
          message: "Update of schedule failed"
        })
      )
      .finally(() => setClickedSchedule(null));
  };

  const modalDeleteSchedule = () => {
    modal.current.close();
    deleteSchedule(clickedSchedule.id)
      .then(() =>
        notify({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: "Schedule was successfully deleted"
        })
      )
      .catch(() =>
        notify({
          type: NOTIFICATION_TYPES.ERROR,
          message: "Removal of Schedule failed"
        })
      )
      .finally(() => setClickedSchedule(null));
  };

  const onOrderChange = (field, value) => {
    setOrder({ field, value });
    getSchedules({ page, limit, sort: field, order: value, search });
  };

  // eslint-disable-next-line react/prop-types
  const OrderTh = props => (
    <Th
      {...props}
      // eslint-disable-next-line react/prop-types
      order={
        props.field === order.field || props.children === order.field
          ? order.value
          : ""
      }
      onClick={onOrderChange}
    />
  );

  const searchSchedules = value => {
    setSearch(value);
    getSchedules({
      page,
      limit,
      sort: order.field,
      order: order.value,
      search: value
    });
  };

  const renderRow = (schedule, idx) => (
    <tr key={idx}>
      <td>{schedule.instance_id}</td>
      <td>{schedule.bot_name}</td>
      <td>
        <StatusButton
          type={schedule.status === "active" ? "success" : "danger"}
          onClick={() => changeScheduleStatus(schedule)}
        >
          {schedule.status}
        </StatusButton>
      </td>
      <td>
        {schedule.details.length > 0 ? (
          <Ul>
            {schedule.details.map((detail, idx) => (
              <li key={idx}>
                <Tag pill type={"info"}>
                  {detail.type + " at " + detail.day + ", " + detail.time}
                </Tag>
              </li>
            ))}
          </Ul>
        ) : (
          "No schedules added yet"
        )}
      </td>
      <td>
        <IconButton type={"primary"} onClick={() => toggleEditModal(schedule)}>
          <Icon name={"edit"} color={theme.colors.white} />
        </IconButton>
        <IconButton type={"danger"} onClick={() => toggleModal(schedule)}>
          <Icon name={"garbage"} color={theme.colors.white} />
        </IconButton>
      </td>
    </tr>
  );

  return (
    <>
      <AddButtonWrap>
        <Button type={"primary"} onClick={toggleAddModal}>
          Add schedule list
        </Button>
      </AddButtonWrap>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter
              onChange={({ value }) => {
                setLimit(value);
                getSchedules({
                  page,
                  limit: value,
                  sort: order.field,
                  order: order.value,
                  search
                });
              }}
            />
            <SearchFilter
              onChange={value => {
                searchSchedules(value);
              }}
            />
          </Filters>
          <Table>
            <Thead>
              <tr>
                <OrderTh field={"instance_id"}>Instance Id</OrderTh>
                <OrderTh field={"bot_name"}>Bot Name</OrderTh>
                <OrderTh field={"status"}>Status</OrderTh>
                <OrderTh field={"details"}>Details</OrderTh>
                <th>Actions</th>
              </tr>
            </Thead>
            <tbody>{schedules.map(renderRow)}</tbody>
          </Table>
          <Paginator
            total={total}
            pageSize={limit}
            onChangePage={page => {
              setPage(page);
              getSchedules({
                page,
                limit,
                sort: order.field,
                order: order.value,
                search
              });
            }}
          />
        </CardBody>
      </Container>

      <Modal
        ref={modal}
        title={"Delete this schedule?"}
        onClose={() => setClickedSchedule(null)}
      >
        <Buttons>
          <Button type={"danger"} onClick={() => modal.current.close()}>
            Cancel
          </Button>
          <Button type={"primary"} onClick={modalDeleteSchedule}>
            Yes
          </Button>
        </Buttons>
      </Modal>

      <Modal
        ref={addModal}
        title={"Add Schedule"}
        contentStyles={modalStyles}
        onClose={() => setInstanceId(null)}
      >
        <SelectWrap>
          <Label>Select one of your running bots</Label>
          <AsyncSelect
            onChange={onBotChange}
            loadOptions={searchBots}
            defaultOptions={runningBots.map(toOptions)}
          />
        </SelectWrap>
        <Buttons>
          <Button type={"danger"} onClick={() => addModal.current.close()}>
            Cancel
          </Button>
          <Button type={"primary"} onClick={addSchedule}>
            Add
          </Button>
        </Buttons>
      </Modal>

      <Modal
        ref={editModal}
        title={"Schedule Editor"}
        contentStyles={modalStyles}
        onClose={() => setClickedSchedule(null)}
      >
        <ScheduleEditor
          schedules={clickedSchedule ? clickedSchedule.details : []}
          close={() => editModal.current.close()}
          onUpdateClick={updateSchedule}
        />
      </Modal>
    </>
  );
};

BotsSchedule.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  notify: PropTypes.func.isRequired,
  getSchedules: PropTypes.func.isRequired,
  updateSchedule: PropTypes.func.isRequired,
  deleteSchedule: PropTypes.func.isRequired,
  getRunningBots: PropTypes.func.isRequired,
  createSchedule: PropTypes.func.isRequired,
  schedules: PropTypes.array.isRequired,
  runningBots: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  schedules: state.schedule.schedules,
  runningBots: state.bot.botInstances,
  total: state.schedule.total
});

const mapDispatchToProps = dispatch => ({
  notify: payload => dispatch(addNotification(payload)),
  getSchedules: query => dispatch(getSchedules(query)),
  createSchedule: data => dispatch(createSchedule(data)),
  updateSchedule: (id, data) => dispatch(updateSchedule(id, data)),
  deleteSchedule: id => dispatch(deleteSchedule(id)),
  getRunningBots: query => dispatch(getRunningBots(query))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(BotsSchedule));
