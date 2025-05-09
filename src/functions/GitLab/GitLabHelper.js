import {
  removeFirstSharp,
  getDateFromDescriptionYaml,
  getNumberFromDescriptionYaml,
  replacePropertyInDescriptionString,
  getDependonFromDescriptionYaml,
} from '../Common/Parser.js';
import {
  getGanttStartDate,
  getGanttDueDate,
  getGanttDuration,
  orgRound,
  adjustDateString,
  isValidVariable,
  getGanttUpdateDate,
} from '../Common/CommonHelper.js';

const getGitLabAssignee = (issue_info) => {
  if (isValidVariable(issue_info) && 'assignee' in issue_info) {
    if (isValidVariable(issue_info.assignee) && 'name' in issue_info.assignee) {
      return issue_info.assignee.name;
    }
  }
  return '';
};

export const generateGanttTaskFromGitLab = (issue_info) => {
  const start_date = getDateFromDescriptionYaml(
    issue_info.description,
    'start_date'
  );
  const due_date = adjustDateString(issue_info.due_date);
  const dateless = (start_date === null || due_date === null);
  var parent = getNumberFromDescriptionYaml(issue_info.description, 'parent');
  if (parent !== null) {
    parent = '#' + parent;
  } else {
    parent = '#0';
  }
  var icon = ''
  if (issue_info.issue_type === 'issue') {
    icon = '📂 ';
  } else if (issue_info.issue_type === 'task') {
    icon = '📋 ';
  }
  var gantt_task = {
    id: '#' + issue_info.iid,
    text: issue_info.time_stats.human_time_estimate !== null ? icon + issue_info.title + ' (' + issue_info.time_stats.human_time_estimate + ')' : icon + issue_info.title,
    state: issue_info.state,
    dateless: dateless,
    start_date: dateless === false ? getGanttStartDate(start_date, due_date, issue_info.created_at) : new Date(new Date().getTime() + 86400000),
    due_date: dateless === false ? getGanttDueDate(start_date, due_date, issue_info.created_at) : new Date(new Date().getTime() + 86400000),
    duration: dateless === false ? getGanttDuration(start_date, due_date, issue_info.created_at) : 1,
    progress: getNumberFromDescriptionYaml(issue_info.description, 'progress'),
    assignee: getGitLabAssignee(issue_info),
    description: issue_info.description,
    update: getGanttUpdateDate(issue_info.created_at, issue_info.updated_at),
    parent: parent,
    _parent: parent,
  };

  let links = [];
  const link = generateLinkFromGitLab(issue_info);
  if (typeof link !== "undefined") {
    for (let i = 0; i < link.length; i++) {
      let prelink = {
        type: link[i].type,
        target: link[i].target,
        source: link[i].source,
      }
      links.push(prelink);
    }
  }
  gantt_task.links = links;
  return gantt_task;
};

export const generateLinkFromGitLab = (issue_info) => {
  const link = [];
  let dependon = [];
  dependon = getDependonFromDescriptionYaml(issue_info.description, 'dependon');
  if (dependon !== null) {
    //let data = [];
    for (let i = 0; i < dependon.length; i++) {
      let data = [];
      data.type = '0';
      data.target = '#' + issue_info.iid;
      data.source = '#' + dependon[i];
      link.push(data);
    }
    return link;
  }
};

export const updateGitLabDescriptionStringFromGanttTask = (
  description,
  gantt_task
) => {
  const start_date_str = adjustDateString(gantt_task.start_date).replace(
    /-/g,
    '/'
  );
  const task = {
    start_date: start_date_str,
    progress: orgRound(gantt_task.progress, 0.01),
  };
  if ('parent' in gantt_task && gantt_task.parent !== null) {
    task.parent = parseInt(removeFirstSharp(gantt_task.parent));
  }
  if ('dependon' in gantt_task) {
    task.dependon = gantt_task.dependon;
  }
  return replacePropertyInDescriptionString(description, task);
};
