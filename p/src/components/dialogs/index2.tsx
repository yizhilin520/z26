import React, { useContext, useEffect, useState, useRef } from 'react'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import style from './style.scss'



// ------------------------------ login ----------------------------------
const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: 16,
      backgroundColor: '#f5faff',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string
  children: React.ReactNode
  onClose: () => void
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <div className={style.close} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})



interface Props {
  open: boolean
  handleClose: () => boolean
  title: React.FC
  content: React.FC
}

const Dialogs = (props: Props) => {
  return (
    <div>
      <Dialog onClose={props.handleClose} aria-labelledby="customized-dialog-title" open={props.open}>
        <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
          {props.title}
        </DialogTitle>
          {props.content}
      </Dialog>
    </div>
  )
}

export default Dialogs
