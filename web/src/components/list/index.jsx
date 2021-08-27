import React, { useEffect, useState, useRef } from "react";
import { Button, Table, Input, DatePicker } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Link from "next/link";
import PropTypes from "prop-types";
import { taskSearch } from "../../api/top-page";

// const { Search } = Input;

const List = ({
  searchIcon,
  text,
  showTimeInput,
  showCategoryInput,
  showMilestoneInput,
  showSearchByJFInput,
  dataColumn,
  dataSource,
  route,
  routeToAdd,
}) => {
  const ref = useRef();
  const [show, setShow] = useState(false);
  const [showSearchIcon, setShowSearchIcon] = useState(searchIcon);
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState(() => ({
    name: "",
    milestone: "",
    category: "",
    date: "",
  }));

  useEffect(() => {
    setList(dataSource);
  }, [dataSource]);

  useEffect(() => {
    const onBodyClick = (event) => {
      if (ref.current.contains(event.target)) {
        return;
      }
      setShow(false);
      setShowSearchIcon(true);
    };

    document.body.addEventListener("click", onBodyClick, { capture: true });

    return () => {
      document.body.removeEventListener("click", onBodyClick, {
        capture: true,
      });
    };
  }, []);
  useEffect(() => {
    let datas = [...list];
    console.log(filter);
    if (filter) {
      if (filter.name) {
        console.log("fil name");
        datas = datas.filter(
          (data) =>
            data.name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1
        );
      }
      if (filter.milestone) {
        console.log("fil mil");
        datas = datas.filter(
          (data) =>
            data.milestone
              .toLowerCase()
              .indexOf(filter.milestone.toLowerCase()) !== -1
        );
      }
      if (filter.category) {
        console.log("fil cate");
        datas = datas.filter(
          (data) =>
            data.category
              .toLowerCase()
              .indexOf(filter.category.toLowerCase()) !== -1
        );
      }
      if (filter.date) {
        if (dataColumn[1].dataIndex === "type")
          filter.date = filter.date.replace("-", "/");
        datas = datas.filter(
          (data) =>
            data.time.toLowerCase().indexOf(filter.date.toLowerCase()) !== -1
        );
      }
      setList(datas);
    }
  }, [filter]);
  const onClick = () => {
    setShow(!show);
    setShowSearchIcon(!showSearchIcon);
  };

  const searchInput = (e, dateString = "") => {
    if (!dateString) {
      console.log(e);
      if (e.target.name === "name") {
        setFilter({ ...filter, name: e.target.value });
        if (e.target.value === "") {
          setFilter({ ...filter, name: "" });
          setList(dataSource);
        }
      }
      if (e.target.name === "milestone") {
        setFilter({ ...filter, milestone: e.target.value });
        if (e.target.value === "") {
          setFilter({ ...filter, milestone: "" });
          setList(dataSource);
        }
      }
      if (e.target.name === "category") {
        setFilter({ ...filter, category: e.target.value });
        if (e.target.value === "") {
          setFilter({ ...filter, category: "" });
          setList(dataSource);
        }
      }
    } else {
      setFilter({ ...filter, date: dateString });
      if (dateString === "") {
        setFilter({ ...filter, date: "" });
        setList(dataSource);
      }
    }
  };
  const searchByJobfairName = (e) => {
    const getTask = async () => {
      const response = await taskSearch(e.target.value);
      let tasks = [];
      tasks = response.data.map((data) => ({
        name: data.name,
        jfName: data.jobfair.name,
        time: data.start_time,
      }));
      setList(tasks);
    };
    getTask();
  };
  return (
    <div ref={ref}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <Link href={route}>
          <a
            style={{
              fontSize: "30px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {text}
          </a>
        </Link>

        <div className="flex items-center">
          {text === "タスク一覧" ? null : (
            <Link href={routeToAdd}>
              <Button
                style={{ border: "none", marginBottom: "5px" }}
                shape="circle"
                icon={<PlusOutlined style={{ fontSize: "30px" }} />}
              />
            </Link>
          )}

          <span className="queue-demo">
            {showSearchIcon && (
              <Button
                style={{ border: "none" }}
                shape="circle"
                icon={
                  <SearchOutlined
                    style={{ marginLeft: "4px", fontSize: "30px" }}
                  />
                }
                onClick={onClick}
              />
            )}

            <span>
              {show ? (
                <Input
                  // key="demo"
                  name="name"
                  className="no-border"
                  placeholder="名前"
                  onChange={searchInput}
                  bordered
                  prefix={<SearchOutlined />}
                />
              ) : null}
            </span>
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateRows: "15% 75%",
          height: "480px",
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            display: "grid",
          }}
        >
          <div className="flex items-center justify-end px-2">
            {showTimeInput && (
              <div className="flex items-center justify-end px-2">
                <div>
                  <DatePicker
                    name="date"
                    size="large"
                    placeholder="タイム"
                    format="YYYY/MM/DD"
                    onChange={searchInput}
                  />
                </div>
              </div>
            )}

            {showSearchByJFInput && (
              <div className="flex items-center justify-end px-2">
                <div>
                  <Input
                    name="jobfairName"
                    placeholder="就職フェアの名前"
                    type="text"
                    onChange={searchByJobfairName}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end px-2">
            {showCategoryInput && (
              <div className="flex items-center justify-end px-2">
                <div>
                  <Input
                    name="category"
                    placeholder="カテゴリ"
                    type="text"
                    onChange={searchInput}
                  />
                </div>
              </div>
            )}

            {showMilestoneInput && (
              <div className="flex items-center justify-end px-2">
                <div>
                  <Input
                    name="milestone"
                    placeholder="マイルストーン"
                    type="text"
                    onChange={searchInput}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table data */}
        <div>
          <Table
            scroll={{ y: 280, x: 240 }}
            pagination={false}
            dataSource={list}
            columns={dataColumn}
          />
        </div>
      </div>
    </div>
  );
};

List.propTypes = {
  searchIcon: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  showTimeInput: PropTypes.bool.isRequired,
  showCategoryInput: PropTypes.bool.isRequired,
  showMilestoneInput: PropTypes.bool.isRequired,
  showSearchByJFInput: PropTypes.bool.isRequired,
  dataColumn: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  route: PropTypes.string.isRequired,
  routeToAdd: PropTypes.string.isRequired,
};

export default List;
