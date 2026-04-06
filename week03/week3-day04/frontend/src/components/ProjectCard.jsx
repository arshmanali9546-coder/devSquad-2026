import { Card, CardContent, CardActions, Typography, Button, Chip, Box, AvatarGroup, Avatar, Tooltip } from '@mui/material';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <Card className="gsap-project-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="div">
            {project.title}
          </Typography>
          <Chip 
            label={project.status} 
            color={project.status === 'completed' ? 'success' : 'primary'} 
            size="small" 
          />
        </Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {project.description}
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {project.techStack?.map((tech, index) => (
            <Chip key={index} label={tech} variant="outlined" size="small" />
          ))}
        </Box>
        
        {project.teamMembers && project.teamMembers.length > 0 && (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="caption" color="text.secondary">Team:</Typography>
            <AvatarGroup max={4}>
              {project.teamMembers.map((member) => (
                <Tooltip key={member.id} title={member.name}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                    {member.name.charAt(0)}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onEdit(project)}>Edit</Button>
        {onDelete && (
          <Button size="small" color="error" onClick={() => onDelete(project.id)}>Delete</Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
