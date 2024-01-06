package com.fpt.scms.services;

import com.fpt.scms.model.dto.TeamDTO;
import com.fpt.scms.model.entity.Team;

import java.util.List;

public interface TeamService {
    TeamDTO getTeamByStudentId(Long userId, Long classId);
    Team createTeamForImport(String teamName, Long classId);
    TeamDTO updateTeam(TeamDTO teamDTO);
    List<TeamDTO> getTeamByClass(Long classId);
}
