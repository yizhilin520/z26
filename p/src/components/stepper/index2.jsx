import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import SettingsIcon from '@material-ui/icons/Settings';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 12,
    left: 'calc(-50% + 10px)',
    right: 'calc(40% + 20px)',
  },
  active: {
    '& $line': {
      background:
        '#65D275',
    },
  },
  completed: {
    '& $line': {
      background:
        '#65D275',
    },
  },
  line: {
    height: 4,
    border: 0,
    backgroundColor: '#D3D8E4',
    borderRadius: 1,
  },
  
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#D3D8E4',
    zIndex: 1,
    color: '#fff',
    width: 23,
    height: 23,
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: '50%',
    top:10,
  },
  active: {
    background:
      '#65D275',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    background:
      '#65D275',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding:0,
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: 8,
    marginBottom: theme.spacing(1),
  },
  StepLabel:{
    color:'#949BB1',
    fontSize: 14
  },
  StepLabelactive:{
    color: '#65D275',
    fontSize: 14
  }
}));

function getSteps() {
  return ['实名认证', '申请专家号', '资料审核', '审核完成'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Select campaign settings...';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown step';
  }
}
  
export default function HorizontalLabelPositionBelowStepper(props) {
  // console.log('pp',props)
  const stepNumber = props.stepNumber
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  
 useEffect(() => {
  setActiveStep(stepNumber)
   return () => {
     
   };
 }, [stepNumber]);
  
  // console.log('activeStep',activeStep)
  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}><p className={`${activeStep === index? classes.StepLabelactive:classes.StepLabel }`}>{label}</p></StepLabel>
          </Step>
        ))}
      </Stepper>

    </div>
  );
}