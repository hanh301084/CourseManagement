package com.fpt.scms.services.Impl;

import com.fpt.scms.execption.ResourceNotFoundException;
import com.fpt.scms.model.dto.TeamDTO;
import com.fpt.scms.model.entity.CheckList;
import com.fpt.scms.model.entity.Class;
import com.fpt.scms.model.entity.ProjectBacklog;
import com.fpt.scms.model.entity.Team;
import com.fpt.scms.repository.CheckListRepository;
import com.fpt.scms.repository.ClassRepository;
import com.fpt.scms.repository.ProjectBacklogRepository;
import com.fpt.scms.repository.TeamRepository;
import com.fpt.scms.services.TeamService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeamServiceImpl implements TeamService {
    @Autowired
    CheckListRepository checkListRepository;
    @Autowired
    private  TeamRepository teamRepository;
    @Autowired
    private ClassRepository classRepository;
    @Autowired
    private ProjectBacklogRepository backlogRepository;
    private final ModelMapper modelMapper = new ModelMapper();
    @Override
    public TeamDTO getTeamByStudentId(Long userId, Long classId) {
        Team team = teamRepository.findByStudentId(userId, classId);
        return modelMapper.map(team, TeamDTO.class);
    }
    public Team createTeamForImport(String teamName, Long classId) {
        Team existingTeam = teamRepository.findByTeamName(teamName, classId);
        if (existingTeam != null) {
            return existingTeam;
        } else {
            Team newTeam = new Team();
            newTeam.setTeamName(teamName);
            Class classEntity = classRepository.findById(classId).orElse(null);
            newTeam.setClassEntity(classEntity);
            newTeam.setCreatedAt(LocalDateTime.now());
            newTeam.setStatus("ACTIVE");
            teamRepository.save(newTeam);
            return newTeam;
        }
    }

    @Override
    public TeamDTO updateTeam(TeamDTO teamDTO) {
        Team team = teamRepository.findById(teamDTO.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("team", String.valueOf(teamDTO.getTeamId()), ""));

        if (team.getProject() != null) {
            List<ProjectBacklog> teamProjectBacklogs = backlogRepository.getByProjectId(team.getProject().getProjectId());
            for (ProjectBacklog pb : teamProjectBacklogs) {
                if (!Objects.equals(pb.getProject().getProjectId(), teamDTO.getProject().getProjectId())) {
                    List<ProjectBacklog> oldBacklogs = backlogRepository.getByTeamId(team.getTeamId());
                    backlogRepository.deleteAll(oldBacklogs);
                }
            }
        }

        modelMapper.map(teamDTO, team);
        team.setUpdatedAt(LocalDateTime.now());

        if (team.getProject() != null) {
            List<ProjectBacklog> projectBacklogs = backlogRepository.getByProjectId(team.getProject().getProjectId());
            List<ProjectBacklog> newBacklogs = new ArrayList<>();
            for (ProjectBacklog backlog : projectBacklogs) {
                ProjectBacklog newBacklog = new ProjectBacklog();
                BeanUtils.copyProperties(backlog, newBacklog);
                newBacklog.setTeam(team);
                backlog.getFunctionChecklists().clear();
                backlog.getFunctionComments().clear();
                newBacklog.setFunctionChecklists(null);
                newBacklog.setFunctionComments(null);
                newBacklog.setProjectBacklogId(null);
                newBacklogs.add(newBacklog);
            }
            backlogRepository.saveAll(newBacklogs);
        }
        CheckList checkList = checkListRepository.findByID(teamDTO.getCheckList().getId());
        checkList.setIs_use("YES");
        checkListRepository.save(checkList);
        Team updatedTeam = teamRepository.save(team);
        return modelMapper.map(updatedTeam, TeamDTO.class);
    }




    @Override
    public List<TeamDTO> getTeamByClass(Long classId) {
       return teamRepository.findAllByClassEntity_ClassIdAndStatusIs(classId, "ACTIVE")
               .stream()
               .map(Team -> modelMapper.map(Team, TeamDTO.class))
               .collect(Collectors.toList());
    }
}
