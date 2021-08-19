import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { List, Select } from 'antd';
import {
  FileDoneOutlined,
  DeleteOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import './styles.scss';

function jfScheduleEditList({
  templateTaskParentList,
  addedTemplateTaskParentList,
  onDeleteTemplateTask,
  onDeleteMilestone,
  onAddTemplateTask,
  milestone,
}) {
  const templateTaskChildernList = _.filter(templateTaskParentList, {
    milestone_id: milestone.id,
  });

  const addedTemplateTaskChildernList = [];
  templateTaskChildernList.forEach((item) => {
    if (_.includes(addedTemplateTaskParentList, item.id)) {
      addedTemplateTaskChildernList.push(item.id);
    }
  });

  // console.log({
  //   templateTaskParentList,
  //   addedTemplateTaskParentList,
  //   templateTaskChildernList,
  //   addedTemplateTaskChildernList,
  //   milestone,
  // });

  const templateTaskOptions = [];
  templateTaskChildernList.forEach((item) => {
    let value = item.id;
    templateTaskOptions.push({
      label: item.name,
      value,
    });
  });

  const selectTemplateTaskProps = {
    mode: 'multiple',
    style: { width: '90%' },
    value: addedTemplateTaskChildernList,
    options: templateTaskOptions,
    onSelect: (id) => {
      onAddTemplateTask(id);
    },
    onDeselect: (id) => {
      onDeleteTemplateTask(id);
    },
    placeholder: 'テンプレートタスク. . .',
    maxTagCount: 'responsive',
    size: 'middle',
  };

  const renderHeader = (milestone) => {
    const { id, name } = milestone;
    return (
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <FileDoneOutlined style={{ fontSize: 32 }} />
          <Link href={`/milestones/${id}`}>
            <a className="ml-4 text-lg">{name}</a>
          </Link>
        </div>
        <div className="w-1/2 flex justify-items-end items-center">
          <Select {...selectTemplateTaskProps} />
          <CloseOutlined
            style={{ fontSize: '24px' }}
            className="ml-5"
            onClick={() => onDeleteMilestone(id)}
          />
        </div>
      </div>
    );
  };

  return (
    <List
      bordered
      header={renderHeader(milestone)}
      dataSource={templateTaskChildernList}
      renderItem={(templateTask) => {
        if (addedTemplateTaskChildernList.includes(templateTask.id))
          return (
            <List.Item>
              <div className="flex justify-between w-full">
                <Link href={`/template-task-dt/${templateTask.id}`}>
                  <a>{templateTask.name}</a>
                </Link>
                <DeleteOutlined
                  onClick={() => {
                    onDeleteTemplateTask(templateTask.id);
                  }}
                  style={{ fontSize: '24px' }}
                />
              </div>
            </List.Item>
          );
      }}
    />
  );
}

export default jfScheduleEditList;
